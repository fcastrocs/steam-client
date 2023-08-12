/**
 * Handle low-level connection to steam.
 * Emits 'socket disconnected' if connection is lost
 */
import { Socket } from "net";
import { SmartBuffer } from "smart-buffer";
import crc32 from "buffer-crc32";
import SteamCrypto, { SessionKey } from "@fcastrocs/steam-client-crypto";
import net from "net";
import { SteamClientError } from "../common.js";
import { EMsg } from "../language/enums_clientserver.proto.js";
import { EResult } from "../language/EResult.js";
import Base from "./Base.js";
import { SocksClient } from "socks";
import { ConnectionOptions } from "../../@types/connections/Base.js";

export default class TCPConnection extends Base {
    public readonly timeout: number = 15000;
    private socket: Socket;
    private encrypted: boolean;
    private incompletePacket: boolean;
    private packetSize = 0;
    private encryptionKey: SessionKey = null;

    constructor(private options: ConnectionOptions) {
        super();

        // set timeout only if greater than 15
        this.timeout = options.timeout ?
            (options.timeout > 15 ? options.timeout : this.timeout) : this.timeout;

        // send data to Steam
        this.on("sendData", (message: Buffer) => {
            // encrypt message
            if (this.encrypted) {
                message = SteamCrypto.encrypt(message, this.encryptionKey.plain);
            }

            const packet = new SmartBuffer();
            packet.writeUInt32LE(message.length);
            packet.writeString(this.MAGIC);
            packet.writeBuffer(message);

            // do not let this fail
            try {
                this.socket.write(packet.toBuffer());
            } catch (error) {
                return;
            }
        })
    }

    /**
     * Connect to Steam CM server.
     */
    public async connect(): Promise<void> {
        // direct connection, no proxy
        if (!this.options.proxy) {
            this.socket = await this.directConnect();
        } else {
            this.socket = await this.proxyConnect();
        }

        this.connected = true;
        this.socket.setTimeout(this.timeout);

        // start reading data
        this.socket.on("readable", () => this.readData());

        // wait for encryption handshake
        return new Promise((resolve, reject) => {
            // expect connection handshake before timeout
            const timeoutId = setTimeout(() => {
                this.destroyConnection();
                reject(new SteamClientError("Encryption handshake timeout."))
            }, this.timeout);

            this.once("encryption-success", () => {
                clearTimeout(timeoutId);
                this.encrypted = true;

                // catch all transmission errors
                this.socket.on("error", (err) => this.destroyConnection(new SteamClientError(err.message)));
                this.socket.on("close", () => this.destroyConnection(new SteamClientError("Remote host closed connection.")));
                this.socket.on("end", () => this.destroyConnection(new SteamClientError("Connection ended.")));
                this.socket.on("timeout", () => this.destroyConnection(new SteamClientError("Connection timed out.")));

                this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });

                resolve();
            });

            this.once("encryption-fail", () => {
                clearTimeout(timeoutId);
                this.destroyConnection();
                reject(new SteamClientError("Encryption handshake failed."));
            });
        });
    }

    private async directConnect(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const socket = net.createConnection(this.options.steamCM);

            const errorListener = (error: Error) => reject(new SteamClientError(error.message));
            socket.once("error", errorListener);

            socket.once("connect", () => {
                socket.removeListener("error", errorListener);
                resolve(socket);
            });
        });
    }

    private async proxyConnect(): Promise<Socket> {
        try {
            const { socket } = await SocksClient.createConnection({
                destination: this.options.steamCM,
                proxy: this.options.proxy,
                command: "connect",
            });
            return socket;
        } catch (error) {
            throw new SteamClientError(error.message);
        }
    }

    public destroyConnection(error?: SteamClientError) {
        super.destroyConnection(error);
        if (this.socket) {
            this.removeAllListeners();
            this.socket.destroy();
            this.socket.removeAllListeners();
            this.socket = null;
        }
    }

    /**
     * Send packet to steam
     * message: Buffer(message.length, MAGIC, proto | channelEncryptResponse)
     */
    private send(message: Buffer) {
        // encrypt message
        if (this.encrypted) {
            message = SteamCrypto.encrypt(message, this.encryptionKey.plain);
        }

        const packet = new SmartBuffer();

        packet.writeUInt32LE(message.length);
        packet.writeString(this.MAGIC);
        packet.writeBuffer(message);

        // do not let this fail
        try {
            this.socket.write(packet.toBuffer());
        } catch (error) {
            return;
        }
    }

    /**
     * MsgHdr:
     * int EMsg
     * int CMsgProtoBufHeader length;
     * Proto CMsgProtoBufHeader buffer
     */
    private buildMsgHdr(EMsg: number): Buffer {
        const sBuffer = new SmartBuffer();
        sBuffer.writeUInt32LE(EMsg);
        sBuffer.writeBigUInt64LE(18446744073709551615n); //tarjetjobid
        sBuffer.writeBigUInt64LE(18446744073709551615n); //sourjobid
        return sBuffer.toBuffer();
    }

    /**
     * Read data sent by steam
     * header: 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
     * Packet: packetsize bytes
     */
    private readData() {
        // not waiting for a packet, decode header
        if (!this.incompletePacket) {
            const header: Buffer = this.socket.read(8);
            if (!header) return;

            this.packetSize = header.readUInt32LE(0);

            if (header.subarray(4).toString("ascii") != this.MAGIC) {
                this.destroyConnection(new SteamClientError("Connection is out of sync."));
                return;
            }
        }

        // read packet
        let packet: Buffer = this.socket.read(this.packetSize);

        // we haven't received the complete packet
        if (!packet) {
            this.incompletePacket = true;
            return;
        }

        // got the complete packet, reset variables
        this.packetSize = 0;
        this.incompletePacket = false;

        // not encrypted yet
        if (!this.encrypted) {
            const sbuffer = SmartBuffer.fromBuffer(packet);

            const rawEMsg = sbuffer.readUInt32LE();
            const EMsgReceived = rawEMsg & ~this.PROTO_MASK;

            sbuffer.readBigUInt64LE(); //jobidTarget 18446744073709551615n
            sbuffer.readBigUInt64LE(); //jobidSource 18446744073709551615n

            if (EMsgReceived === EMsg.ChannelEncryptRequest) {
                return this.channelEncryptResponse(sbuffer);
            }

            if (EMsgReceived === EMsg.ChannelEncryptResult) {
                return this.ChannelEncryptResult(sbuffer);
            }
        } else {
            try {
                packet = SteamCrypto.decrypt(packet, this.encryptionKey.plain);
                this.decodeData(packet);
            } catch (error) {
                this.destroyConnection(new SteamClientError("Data Encryption failed."));
                return;
            }
        }
    }

    /**
     * Send connection encryption response.
     * Starts encryption handshake
     */
    private channelEncryptResponse(body: SmartBuffer) {
        const protocol = body.readUInt32LE();
        body.readUInt32LE(); // skip universe
        const nonce = body.readBuffer();

        this.encryptionKey = SteamCrypto.genSessionKey(nonce);

        const MsgHdr = this.buildMsgHdr(EMsg.ChannelEncryptResponse);

        // MsgChannelEncryptResponse
        const data = new SmartBuffer();
        const keycrc = crc32.unsigned(this.encryptionKey.encrypted);
        data.writeUInt32LE(protocol);
        data.writeUInt32LE(this.encryptionKey.encrypted.length);
        data.writeBuffer(this.encryptionKey.encrypted);
        data.writeUInt32LE(keycrc);
        data.writeUInt32LE(0);

        this.send(Buffer.concat([MsgHdr, data.toBuffer()]));
    }

    /**
     * Connection encryption handshake result
     */
    private ChannelEncryptResult(body: SmartBuffer) {
        const eresult: number = body.readUInt32LE();
        // connection channel successfully encrypted
        if (eresult === EResult.OK) {
            this.emit("encryption-success");
        } else {
            this.emit("encryption-fail");
        }
    }
}
