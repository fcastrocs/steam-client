/* eslint-disable no-bitwise */
/**
 * Handle websocket connection to steam
 * Connection via HTTP, Socks v4 and v5 supported
 */
import crypto from 'crypto';
import tls, { ConnectionOptions } from 'tls';
import net, { Socket } from 'net';
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
        let { proxySocket } = this.options;

        if (!proxySocket) {
            if (this.options.httpProxy) {
                proxySocket = await this.connectHttpProxy();
            } else if (this.options.socksProxy) {
                proxySocket = await this.connectSocksProxy();
            }
        }

        this.socket = await this.tlsUpgradeOrConnect(proxySocket);
        this.connected = true;
        this.handleConnectionEvents(this.socket);
    }

    public disconnect() {
        this.cleanUp();
    }

    private cleanUp(socket?: Socket, error?: Error) {
        this.socket = socket || this.socket;

        if (this.connected) {
            this.connected = false;
            this.socket.end();
            this.socket.destroy();
            this.socket.removeAllListeners();
        }

        this.emit('disconnected', error);
        this.socket = null;
    }

    send(buffer: Buffer) {
        if (this.connected && buffer.length) {
            const frame = createWsBinaryFrame(buffer);
            this.socket.write(frame);
        }
    }

    private async tlsUpgradeOrConnect(existingSocket?: Socket): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const options: ConnectionOptions = {
                socket: existingSocket,
                host: this.url.hostname,
                port: Number(this.url.port),
                servername: this.url.hostname,
                enableTrace: false,
                minVersion: 'TLSv1.3',
                maxVersion: 'TLSv1.3',
                session: null,
                rejectUnauthorized: true
            };

            const socket = tls.connect(options, () => {
                socket.write(this.generateHeaders().join('\r\n'));
            });

            socket.once('secureConnect', () => {
                socket.removeAllListeners();
                resolve(socket);
            });

            this.handleConnectionEvents(socket, reject);
        });
    }

    private async connectHttpProxy(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const { port: proxyPort, host: proxyHost, user, pass } = this.options.httpProxy;

            const proxySocket = net.createConnection({ port: proxyPort, host: proxyHost }, () => {
                proxySocket.setNoDelay(true);

                proxySocket.write(`CONNECT ${this.url.hostname}:${this.url.port} HTTP/1.1\r\n`);
                proxySocket.write(`Host: ${this.url.hostname}:${this.url.port}\r\n`);
                if (user && pass) {
                    const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
                    proxySocket.write(`Proxy-Authorization: Basic ${credentials}\r\n`);
                }
                proxySocket.write('Connection: Keep-Alive\r\n\r\n');
            });

            proxySocket.once('data', (data) => {
                const response = data.toString();
                if (response.includes('200 Connection established')) {
                    proxySocket.removeAllListeners();
                    resolve(proxySocket);
                    return;
                }

                this.cleanUp(proxySocket);
                reject(new Error('HTTP Proxy Error could not establish tunnel to remote host.'));
            });

            this.handleConnectionEvents(proxySocket, reject);
        });
    }

    private async connectSocksProxy(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const { host, port, version } = this.options.socksProxy;

            const socket = net.createConnection(port, host, () => {
                socket.setNoDelay(true);
                if (version === 5) {
                    this.socks5HandShake(socket, resolve, reject);
                }
            });

            this.handleConnectionEvents(socket, reject);
        });
    }

    private socks5HandShake(socket: Socket, resolve: (socket: Socket) => void, reject: (err: Error) => void) {
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
                this.cleanUp(socket);
                return;
            }

            if (data[1] !== 0x00) {
                reject(new Error('SOCKS5 error authentication failed.'));
                this.cleanUp(socket);
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
                    this.cleanUp(socket);
                    return;
                }

                socket.removeAllListeners();
                resolve(socket);
            });
        });
    }

    private handleConnectionEvents(socket: Socket, reject?: (err: Error) => void) {
        socket.setTimeout(this.timeout);

        const cb = (error?: Error) => {
            if (reject) {
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
