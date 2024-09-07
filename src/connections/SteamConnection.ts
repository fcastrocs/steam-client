/* eslint-disable no-bitwise */
/**
 * Handle websocket connection to steam
 * Connection via HTTP, Socks v4 and v5 supported
 */
import crypto from 'crypto';
import tls, { ConnectionOptions, TLSSocket } from 'tls';
import { Socket } from 'net';
import EventEmitter from 'events';
import type { SteamConnectionOptions } from '../../@types';
import { createWsBinaryFrame } from './util';

export default abstract class SteamConnection {
    private url: URL;

    private handshakeKey: string;

    private readonly emitter = new EventEmitter();

    private options: SteamConnectionOptions;

    protected socket: Socket;

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

        const socket = new Socket();
        socket.setNoDelay(true);

        try {
            this.socket = await new Promise<TLSSocket>((resolve, reject) => {
                this.handleConnectionEvents(socket, reject);

                if (this.options.httpProxy) {
                    this.connectHttpProxy(socket, resolve, reject);
                } else if (this.options.socksProxy) {
                    this.connectSocksProxy(socket, resolve, reject);
                } else {
                    this.tlsUpgradeOrConnect(undefined, resolve, reject);
                }
            });

            socket.removeAllListeners();
            this.connected = true;
        } catch (error) {
            this.cleanUp(socket);
            throw error;
        }
    }

    public disconnect() {
        this.cleanUp();
    }

    private cleanUp(socket?: Socket, error?: Error) {
        this.socket = socket || this.socket;

        this.connected = false;
        if (this.socket) {
            this.socket.destroy();
            this.socket.removeAllListeners();
            this.socket = null;
        }

        this.emit('disconnected', error);
    }

    send(buffer: Buffer) {
        if (this.connected) {
            const frame = createWsBinaryFrame(buffer);
            this.socket.write(frame);
        }
    }

    private tlsUpgradeOrConnect(socket: Socket, resolve: (value: TLSSocket) => void, reject: (error: Error) => void) {
        const options: ConnectionOptions = {
            socket,
            host: this.url.hostname,
            port: Number(this.url.port),
            servername: this.url.hostname,
            enableTrace: false,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.2',
            session: null,
            rejectUnauthorized: true
        };

        const tlsSocket = tls.connect(options, () => {
            tlsSocket.write(this.generateHeaders().join('\r\n'));
        });

        if (!socket) {
            this.handleConnectionEvents(tlsSocket, reject);
        }

        tlsSocket.once('data', (data) => {
            if (data && data.toString().includes('Sec-WebSocket-Accept')) {
                resolve(tlsSocket);
            } else {
                reject(new Error(data));
            }
        });
    }

    private connectHttpProxy(socket: Socket, resolve: (value: TLSSocket) => void, reject: (error: Error) => void) {
        const { port: proxyPort, host: proxyHost, user, pass } = this.options.httpProxy;

        socket.connect({ port: proxyPort, host: proxyHost }, () => {
            socket.write(`CONNECT ${this.url.hostname}:${this.url.port} HTTP/1.1\r\n`);
            socket.write(`Host: ${this.url.hostname}:${this.url.port}\r\n`);
            if (user && pass) {
                const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
                socket.write(`Proxy-Authorization: Basic ${credentials}\r\n`);
            }
            socket.write('Connection: Keep-Alive\r\n\r\n');
        });

        socket.once('data', (data) => {
            const response = data.toString();
            if (response.includes('200 Connection established')) {
                this.tlsUpgradeOrConnect(socket, resolve, reject);
                return;
            }

            reject(new Error(`HTTP Proxy Error could not establish tunnel to remote host.\n${response}`));
        });
    }

    private connectSocksProxy(socket: Socket, resolve: (value: TLSSocket) => void, reject: (error: Error) => void) {
        const { host, port, version } = this.options.socksProxy;

        socket.connect(port, host, () => {
            if (version === 5) {
                this.socks5HandShake(socket, resolve, reject);
            }
        });
    }

    private socks5HandShake(socket: Socket, resolve: (value: TLSSocket) => void, reject: (error: Error) => void) {
        const { user, pass } = this.options.socksProxy;
        const hasAuthentication = user && pass;

        const handshake = Buffer.from([
            0x05, // SOCKS5 version
            0x01, // Number of authentication methods supported
            hasAuthentication ? 0x02 : 0x00 // type of authentication
        ]);

        socket.write(handshake);

        socket.once('data', (data) => {
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

            socket.write(request);

            socket.once('data', (response) => {
                if (response[1] !== 0x00) {
                    reject(new Error('SOCKS5 error remote host connection failed.'));
                    return;
                }
                this.tlsUpgradeOrConnect(socket, resolve, reject);
            });
        });
    }

    private handleConnectionEvents(socket: Socket, reject?: (err: Error) => void) {
        socket.setTimeout(this.timeout);

        const cb = (error?: Error) => {
            if (reject && !this.connected) {
                reject(error);
            }
            this.cleanUp(socket, error);
        };

        socket.once('error', cb);

        socket.once('end', () => {
            cb(new Error('Connection ended.'));
        });

        socket.once('close', () => {
            cb(new Error('Connection closed.'));
        });

        socket.once('timeout', () => {
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
