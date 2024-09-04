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

export default abstract class SteamConnection {
    private readonly url: URL;

    private readonly handshakeKey: string;

    protected socket: Socket;

    protected connected: boolean;

    private readonly emitter = new EventEmitter();

    readonly timeout: number;

    constructor(protected options: SteamConnectionOptions) {
        this.url = new URL(`wss://${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`);
        this.handshakeKey = crypto.randomBytes(16).toString('base64');
        this.timeout = this.options.timeout || 15000;
    }

    protected async connect() {
        if (this.connected) return;

        let proxySocket: Socket;

        if (this.options.httpProxy) {
            proxySocket = await this.connectHttpProxy();
        } else if (this.options.socksProxy) {
            proxySocket = await this.connectSocksProxy();
        }

        this.socket = await this.tlsUpgradeOrConnect(proxySocket);
        this.connected = true;
        this.socketEvents();
    }

    protected disconnect() {
        if (this.connected) {
            this.connected = false;
            this.socket.destroy();
        }
    }

    send(buffer: Uint8Array) {
        if (this.connected) {
            this.socket.write(buffer);
        }
    }

    private socketEvents() {
        const handleEvent = (error: Error) => {
            if (this.connected) {
                this.connected = false;
                this.socket.destroy();
                this.emit('disconnected', error);
            }
        };

        this.socket.once('error', (error) => {
            handleEvent(error);
        });

        this.socket.once('timeout', () => {
            handleEvent(new Error('Timeout: connection idled for too long.'));
        });

        this.socket.once('end', () => {
            handleEvent(new Error('Connection ended by the other side.'));
        });
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
                session: null,
                rejectUnauthorized: true
            };

            const socket = tls.connect(options, () => {
                socket.setNoDelay(true);
                socket.write(this.generateHeaders().join('\r\n'));
            });

            socket.once('data', () => {
                this.removeConnectionEvents(socket);
                resolve(socket);
            });

            this.handleConnectionEvents(socket, reject);
        });
    }

    private async connectHttpProxy(): Promise<Socket> {
        return new Promise((resolve, reject) => {
            const { port: proxyPort, host: proxyHost, user, pass } = this.options.httpProxy;

            const proxySocket = net.connect(proxyPort, proxyHost, () => {
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
                    this.removeConnectionEvents(proxySocket);
                    resolve(proxySocket);
                    return;
                }
                reject(new Error('HTTP Proxy Error: could not establish tunnel to remote host.'));
                proxySocket.destroy();
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
                reject(new Error('SOCKS5 error: invalid response.'));
                socket.destroy();
                return;
            }

            if (data[1] !== 0x00) {
                reject(new Error('SOCKS5 error: authentication failed.'));
                socket.destroy();
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
                    reject(new Error('SOCKS5 error: remote host connection failed.'));
                    socket.destroy();
                    return;
                }
                this.removeConnectionEvents(socket);
                resolve(socket);
            });
        });
    }

    private handleConnectionEvents(socket: Socket, reject: (err: Error) => void) {
        if (this.connected) throw new Error('Do you use this method for established connections.');

        socket.setTimeout(this.timeout);

        socket.once('error', (err: Error) => {
            reject(err);
            socket.destroy();
        });

        // Handle the 'end' event
        socket.once('end', () => {
            reject(new Error('Connection ended: other side finished sending data.'));
            socket.destroy();
        });

        socket.once('timeout', () => {
            reject(new Error('Timeout: connection idled for too long.'));
            socket.destroy();
        });
    }

    private removeConnectionEvents(socket: Socket) {
        if (this.connected) throw new Error('Do not use this method for established connections.');
        socket.removeAllListeners('error');
        socket.removeAllListeners('timeout');
        socket.removeAllListeners('end');
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

    on(event: string, listener: (...args: any[]) => void) {
        this.emitter.on(event, listener);
    }

    once(event: string, listener: (...args: any[]) => void) {
        this.emitter.once(event, listener);
    }
}
