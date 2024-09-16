/* eslint-disable no-bitwise */

/**
 * Handle TCP connection to Steam
 */
// import crypto from 'crypto';
import net from 'net';
import EventEmitter from 'events';
import SteamCrypto, { SessionKey } from '@fcastrocs/steam-client-crypto';
import { SmartBuffer } from 'smart-buffer';
import { type SteamConnectionOptions } from '../../@types';
import Base from './Base';
import Language from '../modules/language.js';

const MAGIC = Buffer.from('VT01');

export default class SteamTcp extends Base {
    private connectionEncrypted: boolean;

    private encryptionKey: SessionKey;

    constructor(protected emitter: EventEmitter) {
        super(emitter);
    }

    async connect(options: SteamConnectionOptions): Promise<void> {
        if (this.connected) {
            throw new Error('Already Connected');
        }

        this.beforeConnect(options);

        try {
            if (this.options.proxy) {
                await this.connectViaProxy();
                this.socket = this.proxySocket;
            } else {
                await this.directConnect();
            }

            // encrypt connection
            await this.encryptionHandShake();
            this.socket.removeAllListeners('data');
            this.connected = true;
        } catch (error) {
            this.cleanUp();
            throw error;
        }
    }

    private async encryptionHandShake() {
        this.socket.removeAllListeners();

        return new Promise<void>((resolve, reject) => {
            this.handleConnectionEvents(this.socket, reject);

            this.socket.on('data', (data) => {
                if (!this.connectionEncrypted) {
                    const payload = this.getPayloadFromFrame(data);
                    this.handleUncryptedPayload(payload, resolve, reject);
                }
            });
        });
    }

    private async directConnect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket = net.createConnection(this.options.steamCM, () => {
                resolve();
            });
            this.handleConnectionEvents(this.socket, reject);
        });
    }

    disconnect() {
        this.cleanUp();
    }

    send(buffer: Buffer) {
        this.socket.write(this.createBinaryFrame(buffer));
    }

    /**
     * [header, payload]
     * header: 8 bytes [payloadLen(UInt32), magic(4 bytes string)]
     */
    createBinaryFrame(data: Buffer): Buffer {
        const payload = this.connectionEncrypted ? SteamCrypto.encrypt(data, this.encryptionKey.plain) : data;

        // header
        const frame = Buffer.allocUnsafe(4 + MAGIC.length + payload.length);
        frame.writeUInt32LE(payload.length, 0);
        frame.set(MAGIC, 4);

        frame.set(payload, 4 + MAGIC.length);

        return frame;
    }

    /**
     * [header, payload]
     * header: 8 bytes [payloadLen(UInt32), magic(4 bytes string)]
     */
    getPayloadFromFrame(data: Buffer): Buffer {
        if (this.connectionEncrypted) {
            //     try {
            //         const decryptedFrame = SteamCrypto.decrypt(frame, this.encryptionKey.plain);
            //         this.getPayloadFromFrame(decryptedFrame);
            //     } catch (error) {
            //         this.destroyConnection(new Error('Data Encryption failed.'));
            //     }
        }

        // new packet
        if (!this.payload.buffer.length) {
            // read header [payload length, magic]
            this.payload.length = data.readUInt32LE(0); // 4 bytes
            const magic = data.subarray(4, 8); // 4 bytes

            if (Buffer.compare(magic, MAGIC) !== 0) {
                throw new Error('Steam sent bad data');
            }

            this.payload.buffer = data.subarray(8, 8 + this.payload.length);
        }
        // this should be a continuation of the binary message, if not it will get discarded when steam sends a new message
        else if (this.payload.buffer.length) {
            this.payload.buffer = Buffer.concat([
                this.payload.buffer,
                data.subarray(0, this.payload.length - this.payload.buffer.length)
            ]);
        }

        // done
        if (this.payload.buffer.length >= this.payload.length) {
            const payload = this.payload.buffer;
            this.resetPayloadState();
            return this.unEncryptFrame(payload);
        }

        return null;
    }

    private unEncryptFrame(frame: Buffer) {
        if (!this.connectionEncrypted) {
            return frame;
        }

        let unEncryptedFrame;
        try {
            unEncryptedFrame = SteamCrypto.decrypt(frame, this.encryptionKey.plain);
        } catch (error) {
            throw new Error('Data decryption failed.');
        }

        return unEncryptedFrame;
    }

    private handleUncryptedPayload(body: Buffer, resolve: () => void, reject: (err: Error) => void) {
        const maskedEMsg = body.readUInt32LE(); // masked EMsg - 4 bytes
        // body.readBigUInt64LE(); // jobidTarget - 8 bytes
        // body.readBigUInt64LE(); // jobidSource - 8 bytes

        const EMsg = maskedEMsg & ~0x80000000;

        // reponse to encryption request from steam
        if (EMsg === Language.EMsg.ChannelEncryptRequest) {
            const protocol = body.readUInt32LE(20); //  protocol - 4 bytes
            // body.readUInt32LE(24); //  universe - 4 bytes
            const nonce = body.subarray(28);

            this.encryptionKey = SteamCrypto.genSessionKey(nonce);
            const keycrc = SteamCrypto.crc32(this.encryptionKey.encrypted);

            const sBuffer = new SmartBuffer();
            sBuffer.writeUInt32LE(Language.EMsg.ChannelEncryptResponse);
            sBuffer.writeBigUInt64LE(18446744073709551615n); // tarjetjobid
            sBuffer.writeBigUInt64LE(18446744073709551615n); // sourjobid
            sBuffer.writeUInt32LE(protocol);
            sBuffer.writeUInt32LE(this.encryptionKey.encrypted.length);
            sBuffer.writeBuffer(this.encryptionKey.encrypted);
            sBuffer.writeUInt32LE(keycrc);
            sBuffer.writeUInt32LE(0);

            this.send(sBuffer.toBuffer());
        }
        // result from encryption handshake
        else if (EMsg === Language.EMsg.ChannelEncryptResult) {
            const eresult: number = body.readUInt32LE(20);
            if (body.readUInt32LE(20) === Language.EResult.OK) {
                this.connectionEncrypted = true;
                resolve();
            } else {
                reject(new Error(`Channel encryption failed result ${Language.EResult[eresult]}`));
            }
        }
    }
}
