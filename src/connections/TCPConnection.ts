/**
 * Handle TCP connection to steam
 */

import net, { Socket } from 'net';
import { SmartBuffer } from 'smart-buffer';
import crc32 from 'buffer-crc32';
import SteamCrypto, { SessionKey } from '@fcastrocs/steam-client-crypto';
import { SocksClient } from 'socks';
import Base from './Base.js';
import { SteamClientError } from '../modules/common.js';
import Language from '../modules/language.js';
import type { ConnectionOptions } from '../../@types/index.js';

const { EMsg, EResult } = Language;

export default class TCPConnection extends Base {
    public readonly timeout: number = 15000;

    private socket: Socket;

    private encrypted: boolean;

    private incompletePacket: boolean;

    private packetSize: number;

    private encryptionKey: SessionKey;

    constructor(protected options: ConnectionOptions) {
        super(options);

        // send data: [data length, MAGIC, message]
        this.on('sendData', this.send);
    }

    /**
     * Connect to Steam CM server.
     */
    public async connect(): Promise<void> {
        if (this.isConnected()) throw new SteamClientError('Client is already connected to Steam.');

        // direct connection, no proxy
        if (!this.options.proxy) {
            this.socket = await this.directConnect();
        } else {
            this.socket = await this.proxyConnect();
        }

        this.establishedConn = true;
        this.socket.setTimeout(this.timeout);

        this.socket.on('readable', () => this.readData());
        await this.waitForEncryptionHandshake();
    }

    private async waitForEncryptionHandshake(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.destroyConnection();
                reject(new SteamClientError('Connecting to Steam timeout.'));
            }, this.timeout);

            this.once('encryption-success', () => {
                clearTimeout(timeoutId);
                this.handleSuccessfulEncryption();
                resolve();
            });

            this.once('encryption-fail', () => {
                clearTimeout(timeoutId);
                this.destroyConnection();
                reject(new SteamClientError('Encryption handshake failed.'));
            });
        });
    }

    private handleSuccessfulEncryption() {
        this.encrypted = true;

        // catch all transmission errors
        this.socket.on('error', (err) => this.destroyConnection(new SteamClientError(err.message)));
        this.socket.on('close', () => this.destroyConnection(new SteamClientError('Remote host closed connection.')));
        this.socket.on('end', () => this.destroyConnection(new SteamClientError('Connection ended.')));
        this.socket.on('timeout', () => this.destroyConnection(new SteamClientError('Connection timed out.')));

        this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });
    }

    private async directConnect(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection(this.options.steamCM);

            const errorListener = (error: Error) => reject(new SteamClientError(error.message));
            socket.once('error', errorListener);

            socket.once('connect', () => {
                socket.removeListener('error', errorListener);
                resolve(socket);
            });
        });
    }

    private async proxyConnect(): Promise<Socket> {
        const { socket } = await SocksClient.createConnection({
            destination: this.options.steamCM,
            proxy: {
                host: this.options.proxy.host,
                port: this.options.proxy.port,
                type: this.options.proxy.socksType,
                userId: this.options.proxy.user,
                password: this.options.proxy.pass
            },
            command: 'connect'
        });
        return socket;
    }

    public destroyConnection(error?: SteamClientError) {
        super.destroyConnection(error);
        if (this.socket) {
            this.removeAllListeners();
            this.socket.destroy();
            this.socket.removeAllListeners();
        }
    }

    /**
     * Send data
     * [message.length, MAGIC, message: [steam proto | channelEncryptResponse]]
     */
    private send(message: Buffer) {
        let encryptedMsg = message;

        // encrypt message
        if (this.encrypted) {
            encryptedMsg = SteamCrypto.encrypt(message, this.encryptionKey.plain);
        }

        const packet = new SmartBuffer();

        packet.writeUInt32LE(encryptedMsg.length);
        packet.writeString(this.MAGIC);
        packet.writeBuffer(encryptedMsg);

        // do not let this fail
        try {
            this.socket.write(packet.toBuffer());
        } catch (error) {
            /* empty */
        }
    }

    /**
     * Read data
     * [header, packet]
     * where header: 8 bytes [packetSize(UInt32), magic(4 bytes string)]
     */
    private readData() {
        if (!this.readHeader()) {
            return;
        }

        // read packet
        const packet: Buffer = this.socket.read(this.packetSize);
        if (!packet) {
            this.incompletePacket = true;
            return;
        }

        // we got the packet
        this.resetPacketState();

        if (!this.encrypted) {
            this.handleUnencryptedPacket(packet);
        } else {
            this.handleEncryptedPacket(packet);
        }
    }

    private readHeader(): boolean {
        if (!this.incompletePacket) {
            const header: Buffer = this.socket.read(8);
            if (!header) {
                return false;
            }

            this.packetSize = header.readUInt32LE(0);

            if (header.subarray(4).toString('ascii') !== this.MAGIC) {
                this.destroyConnection(new SteamClientError('Steam sent bad data.'));
                return false;
            }
        }
        return true;
    }

    private resetPacketState(): void {
        this.packetSize = 0;
        this.incompletePacket = false;
    }

    private handleUnencryptedPacket(packet: Buffer): void {
        const sbuffer = SmartBuffer.fromBuffer(packet);
        const rawEMsg = sbuffer.readUInt32LE();
        // eslint-disable-next-line no-bitwise
        const EMsgReceived = rawEMsg & ~this.PROTO_MASK;

        sbuffer.readBigUInt64LE(); // jobidTarget
        sbuffer.readBigUInt64LE(); // jobidSource

        if (EMsgReceived === EMsg.ChannelEncryptRequest) {
            this.channelEncryptResponse(sbuffer);
        } else if (EMsgReceived === EMsg.ChannelEncryptResult) {
            this.ChannelEncryptResult(sbuffer);
        }
    }

    private handleEncryptedPacket(packet: Buffer): void {
        try {
            const decryptedPacket = SteamCrypto.decrypt(packet, this.encryptionKey.plain);
            this.decodeData(decryptedPacket);
        } catch (error) {
            this.destroyConnection(new SteamClientError('Data Encryption failed.'));
        }
    }

    /**
     * Send connection encryption response.
     */
    private channelEncryptResponse(body: SmartBuffer) {
        const protocol = body.readUInt32LE();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const universe = body.readUInt32LE();
        const nonce = body.readBuffer();

        this.encryptionKey = SteamCrypto.genSessionKey(nonce);
        const keycrc = crc32.unsigned(this.encryptionKey.encrypted);

        const sBuffer = new SmartBuffer();
        sBuffer.writeUInt32LE(EMsg.ChannelEncryptResponse);
        sBuffer.writeBigUInt64LE(18446744073709551615n); // tarjetjobid
        sBuffer.writeBigUInt64LE(18446744073709551615n); // sourjobid
        sBuffer.writeUInt32LE(protocol);
        sBuffer.writeUInt32LE(this.encryptionKey.encrypted.length);
        sBuffer.writeBuffer(this.encryptionKey.encrypted);
        sBuffer.writeUInt32LE(keycrc);
        sBuffer.writeUInt32LE(0);

        this.send(sBuffer.toBuffer());
    }

    /**
     * Connection encryption handshake result
     */
    private ChannelEncryptResult(body: SmartBuffer) {
        const eresult: number = body.readUInt32LE();
        // connection channel successfully encrypted
        if (eresult === EResult.OK) {
            this.emit('encryption-success');
        } else {
            this.emit('encryption-fail');
        }
    }
}
