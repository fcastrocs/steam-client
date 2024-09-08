/* eslint-disable no-bitwise */
/**
 * Handle websocket connection to steam
 * Connection via HTTP, Socks v4 and v5 supported
 */
import crypto from 'crypto';
import tls, { ConnectionOptions } from 'tls';
import { Socket } from 'net';
import EventEmitter from 'events';
import type { SteamConnectionOptions } from '../../@types';
import { createWsBinaryFrame } from './util';

export default abstract class SteamConnection {
    private url: URL;

    private handshakeKey: string;

    private readonly emitter = new EventEmitter();

    private options: SteamConnectionOptions;

    private cleanedUp: boolean;

    protected socket: Socket;

    private proxySocket: Socket;

    protected connected: boolean;

    timeout: number;

    protected async connect(options: SteamConnectionOptions): Promise<void> {
        if (this.connected) {
            throw new Error('Already Connected');
        }

        this.options = options;
        this.url = new URL(`wss://${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`);
        this.handshakeKey = crypto.randomBytes(16).toString('base64');
        this.timeout = this.options.timeout || 15000;
        this.cleanedUp = false;

        this.proxySocket = new Socket();
        this.proxySocket.setNoDelay(true);

        try {
            await new Promise<void>((resolve, reject) => {
                this.handleConnectionEvents(this.proxySocket, reject);

                if (this.options.httpProxy) {
                    this.connectHttpProxy(resolve, reject);
                } else if (this.options.socksProxy) {
                    this.connectSocksProxy(resolve, reject);
                } else {
                    this.tlsUpgradeOrConnect(resolve, reject);
                }
            });

            this.connected = true;
        } catch (error) {
            this.cleanUp();
            throw error;
        }
    }

    public disconnect() {
        this.cleanUp();
    }

    private cleanUp(error?: Error) {
        this.connected = false;

        if (!this.cleanedUp) {
            if (this.socket) {
                this.socket.destroy();
                this.socket = null;
            }

            if (this.proxySocket) {
                this.proxySocket.destroy();
                this.proxySocket = null;
            }

            this.emit('disconnected', error);
        }

        this.cleanedUp = true;
    }

    send(buffer: Buffer) {
        if (this.connected) {
            const frame = createWsBinaryFrame(buffer);
            this.socket.write(frame);
        }
    }

    private tlsUpgradeOrConnect(resolve: () => void, reject: (error: Error) => void) {
        const options: ConnectionOptions = {
            socket: this.options.httpProxy || this.options.socksProxy ? this.proxySocket : undefined,
            host: this.url.hostname,
            port: Number(this.url.port),
            servername: this.url.hostname,
            enableTrace: false,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.2',
            rejectUnauthorized: true
        };

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
    }

    private connectHttpProxy(resolve: () => void, reject: (error: Error) => void) {
        const { port: proxyPort, host: proxyHost, user, pass } = this.options.httpProxy;

        this.proxySocket.connect({ port: proxyPort, host: proxyHost }, () => {
            this.proxySocket.write(`CONNECT ${this.url.hostname}:${this.url.port} HTTP/1.1\r\n`);
            this.proxySocket.write(`Host: ${this.url.hostname}:${this.url.port}\r\n`);
            if (user && pass) {
                const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
                this.proxySocket.write(`Proxy-Authorization: Basic ${credentials}\r\n`);
            }
            this.proxySocket.write('Connection: Keep-Alive\r\n\r\n');
        });

        this.proxySocket.once('data', (data) => {
            const response = data.toString();
            if (response.includes('200 Connection established')) {
                this.tlsUpgradeOrConnect(resolve, reject);
                return;
            }

            reject(new Error(`HTTP Proxy Error could not establish tunnel to remote host.\n${response}`));
        });
    }

    private connectSocksProxy(resolve: () => void, reject: (error: Error) => void) {
        const { host, port, version } = this.options.socksProxy;

        this.proxySocket.connect(port, host, () => {
            if (version === 5) {
                this.socks5HandShake(resolve, reject);
            }
        });
    }

    private socks5HandShake(resolve: () => void, reject: (error: Error) => void) {
        const { user, pass } = this.options.socksProxy;
        const hasAuthentication = user && pass;

        const handshake = Buffer.from([
            0x05, // SOCKS5 version
            0x01, // Number of authentication methods supported
            hasAuthentication ? 0x02 : 0x00 // type of authentication
        ]);

        this.proxySocket.write(handshake);

        this.proxySocket.once('data', (data) => {
            if (data[0] !== 0x05) {
                reject(new Error('SOCKS5 error invalid response.'));
                return;
            }

            if (data[1] !== 0x00) {
                reject(new Error('SOCKS5 error authentication failed.'));
                return;
            }

            const request = Buffer.from([
                0x05, // SOCKS5 version
                0x01, // CONNECT command
                0x00, // Reserved
                0x03, // Address type: domain name
                this.url.hostname.length, // Length of the domain name
                ...Buffer.from(this.url.hostname), // Domain name
                (Number(this.url.port) >> 8) & 0xff, // High byte of destination port
                Number(this.url.port) & 0xff // Low byte of destination port
            ]);

            this.proxySocket.write(request);

            this.proxySocket.once('data', (response) => {
                if (response[1] !== 0x00) {
                    reject(new Error('SOCKS5 error remote host connection failed.'));
                    return;
                }
                this.tlsUpgradeOrConnect(resolve, reject);
            });
        });
    }

    private handleConnectionEvents(socket: Socket, reject: (err: Error) => void) {
        socket.setTimeout(this.timeout);

        const cb = (error?: Error) => {
            this.cleanUp(error);

            if (!this.connected) {
                reject(error);
            }
        };

        socket.on('error', (error) => {
            cb(error);
        });

        socket.on('end', () => {
            cb(new Error('Connection ended.'));
        });

        socket.on('close', () => {
            cb(new Error('Connection closed.'));
        });

        socket.on('timeout', () => {
            cb(new Error('Connection timedout.'));
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

    protected emit(event: string, ...args: any[]) {
        this.emitter.emit(event, ...args);
    }

    protected removeListeners(eventName: string) {
        this.emitter.removeAllListeners(eventName);
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.emitter.on(event, listener);
    }

    once(event: string, listener: (...args: any[]) => void) {
        this.emitter.once(event, listener);
    }
}
