/* eslint-disable no-bitwise */

/**
 * Handle WebSocket connection to Steam
 */
import crypto from 'crypto';
import tls, { ConnectionOptions } from 'tls';
import EventEmitter from 'events';
import type { SteamConnectionOptions } from '../../@types';
import Base from './Base';

export default class SteamWs extends Base {
    private handshakeKey: string;

    constructor(protected emitter: EventEmitter) {
        super(emitter);
    }

    async connect(options: SteamConnectionOptions): Promise<void> {
        if (this.connected) {
            throw new Error('Already Connected');
        }

        this.options = options;
        this.url = new URL(`wss://${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`);
        this.handshakeKey = crypto.randomBytes(16).toString('base64');
        this.options.timeout = this.options.timeout || 15000;
        this.cleanedUp = false;

        try {
            // connect to proxy if one was specified
            await this.connectToProxy();
            // upgrade or connect via tls
            await this.tlsUpgradeOrConnect();

            this.connected = true;
        } catch (error) {
            this.cleanUp();
            throw error;
        }
    }

    public disconnect() {
        this.cleanUp();
    }

    send(buffer: Buffer) {
        if (this.connected) {
            const frame = this.createBinaryFrame(buffer);
            this.socket.write(frame);
        }
    }

    private tlsUpgradeOrConnect() {
        const options: ConnectionOptions = {
            socket: this.proxySocket,
            host: this.url.hostname,
            port: Number(this.url.port),
            servername: this.url.hostname,
            enableTrace: false,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.2',
            rejectUnauthorized: true
        };

        return new Promise<void>((resolve, reject) => {
            if (!this.cleanedUp) {
                this.socket = tls.connect(options, () => {
                    this.socket.setNoDelay(true);
                    this.socket.write(this.generateHeaders().join('\r\n'));
                });

                this.handleConnectionEvents(this.socket, reject);

                this.socket.once('data', (data) => {
                    if (data && data.toString().includes('Sec-WebSocket-Accept')) {
                        resolve();
                    } else {
                        reject(new Error(data.toString()));
                    }
                });
            }
        });
    }

    private generateHeaders() {
        return [
            `GET ${this.url.pathname} HTTP/1.1`,
            `Host: ${this.url.host}`,
            'Upgrade: websocket',
            'Connection: Upgrade',
            `Sec-WebSocket-Key: ${this.handshakeKey}`,
            'Sec-WebSocket-Version: 13',
            '\r\n'
        ];
    }

    public createBinaryFrame(data: Buffer): Buffer {
        if (!this.connected) return null;

        const { length } = data;
        let payloadBuffer: Buffer;
        const maskKey = Buffer.allocUnsafe(4);
        maskKey.writeUInt32BE(Math.floor(Math.random() * 0xffffffff));

        let offset = 0;

        // Determine payload length and allocate buffer accordingly
        if (length < 126) {
            payloadBuffer = Buffer.allocUnsafe(6 + length);
            payloadBuffer[1] = 0x80 | length;
            offset = 6; // Header (2 bytes) + Mask key (4 bytes)
        } else if (length < 65536) {
            payloadBuffer = Buffer.allocUnsafe(8 + length);
            payloadBuffer[1] = 0x80 | 126;
            payloadBuffer.writeUInt16BE(length, 2);
            offset = 8; // Header (2 bytes) + Length (2 bytes) + Mask key (4 bytes)
        } else {
            payloadBuffer = Buffer.allocUnsafe(14 + length);
            payloadBuffer[1] = 0x80 | 127;
            payloadBuffer.writeBigUInt64BE(BigInt(length), 2);
            offset = 14; // Header (2 bytes) + Length (8 bytes) + Mask key (4 bytes)
        }

        // Set FIN and Opcode for binary data, and add mask key
        payloadBuffer[0] = 0x82;
        payloadBuffer.set(maskKey, offset - 4);

        // XOR payload data with masking key
        for (let i = 0; i < length; i += 1) {
            payloadBuffer[offset + i] = data[i] ^ maskKey[i % 4];
        }

        return payloadBuffer;
    }

    public getPayloadFromFrame(data: Buffer): Buffer {
        if (!data.length) return null;

        // new binary message
        if (data[0] === 0x82) {
            this.payload.buffer = Buffer.alloc(0);
            this.payload.length = 0;

            this.payload.length = data[1] & 0x7f;
            let offset = 2;

            if (this.payload.length === 126) {
                this.payload.length = data.readUInt16BE(2);
                offset += 2;
            } else if (this.payload.length === 127) {
                this.payload.length = Number(data.readBigUInt64BE(2)); // Use BigInt for 64-bit length
                offset += 8;
            }

            // Extract the payload
            this.payload.buffer = data.subarray(offset, offset + this.payload.length);
        }
        // this should be a continuation of the binary message, if not it will get discarded by a new message
        else if (this.payload.buffer.length) {
            this.payload.buffer = Buffer.concat([
                this.payload.buffer,
                data.subarray(0, this.payload.length - this.payload.buffer.length)
            ]);
        }

        // done
        if (this.payload.buffer.length >= this.payload.length) {
            return this.payload.buffer;
        }

        return null;
    }
}
