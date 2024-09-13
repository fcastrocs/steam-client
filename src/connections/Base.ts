/* eslint-disable no-bitwise */
/**
 * Handle raw connections to Steam
 * Catch connection errors/drops/timeouts
 * Emits 'disconnected' if connection is lost
 */

import { Socket } from 'net';
import EventEmitter from 'events';
import type { SteamConnectionOptions } from '../../@types';

export default abstract class Base {
    protected options: SteamConnectionOptions;

    protected cleanedUp: boolean;

    protected proxySocket: Socket;

    protected payload = {
        buffer: Buffer.alloc(0),
        length: 0
    };

    socket: Socket;

    connected: boolean;

    constructor(protected emitter: EventEmitter) {}

    protected beforeConnect(options: SteamConnectionOptions) {
        this.options = options;
        this.options.timeout = this.options.timeout || 15000;
        this.cleanedUp = false;
    }

    protected disconnect() {
        this.cleanUp();
    }

    protected connectViaProxy() {
        return new Promise<void>((resolve, reject) => {
            if (this.options.httpProxy || this.options.socksProxy) {
                this.proxySocket = new Socket();
                this.proxySocket.setNoDelay(true);
                this.handleConnectionEvents(this.proxySocket, reject);
            }

            if (this.options.httpProxy) {
                this.connectHttpProxy(resolve, reject);
            } else if (this.options.socksProxy) {
                this.connectSocksProxy(resolve, reject);
            } else {
                resolve();
            }
        });
    }

    protected cleanUp(error?: Error) {
        this.connected = false;

        if (!this.cleanedUp) {
            if (this.socket) {
                this.socket.destroy();
                this.socket = undefined;
            }

            if (this.proxySocket) {
                this.proxySocket.destroy();
                this.proxySocket = undefined;
            }

            this.payload = {
                buffer: Buffer.alloc(0),
                length: 0
            };

            this.emitter.emit('disconnected', error);
        }

        this.cleanedUp = true;
    }

    protected handleConnectionEvents(socket: Socket, reject: (err: Error) => void) {
        socket.setTimeout(this.options.timeout);

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

    private connectHttpProxy(resolve: () => void, reject: (error: Error) => void) {
        const { port: proxyPort, host: proxyHost, user, pass } = this.options.httpProxy;
        const { host: steamHost, port: steamPort } = this.options.steamCM;

        this.proxySocket.connect({ port: proxyPort, host: proxyHost }, () => {
            this.proxySocket.write(`CONNECT ${steamHost}:${steamPort} HTTP/1.1\r\n`);
            this.proxySocket.write(`Host: ${steamHost}:${steamPort}\r\n`);
            if (user && pass) {
                const credentials = Buffer.from(`${user}:${pass}`).toString('base64');
                this.proxySocket.write(`Proxy-Authorization: Basic ${credentials}\r\n`);
            }
            this.proxySocket.write('Connection: Keep-Alive\r\n\r\n');
        });

        this.proxySocket.once('data', (data) => {
            const response = data.toString();
            if (response.includes('200 Connection established')) {
                resolve();
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
        const { host: steamHost, port: steamPort } = this.options.steamCM;
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

            let addressType;
            let addressBuffer;

            // Check if it's an IP address or domain name
            if (isIpAddress(steamHost)) {
                // IPv4 case
                addressType = 0x01; // Address type: IPv4
                addressBuffer = Buffer.from(steamHost.split('.').map(Number)); // Convert IP to byte array
            } else if (isIpv6Address(steamHost)) {
                // IPv6 case
                addressType = 0x04; // Address type: IPv6
                addressBuffer = Buffer.from(steamHost.split(':').map((part) => parseInt(part, 16))); // Convert IPv6 to byte array
            } else {
                // Domain name case
                addressType = 0x03; // Address type: domain name
                addressBuffer = Buffer.from([steamHost.length, ...Buffer.from(steamHost)]); // Domain name with length prefix
            }

            const request = Buffer.concat([
                Buffer.from([
                    0x05, // SOCKS5 version
                    0x01, // CONNECT command
                    0x00, // Reserved
                    addressType // Address type
                ]),
                addressBuffer,
                Buffer.from([
                    (Number(steamPort) >> 8) & 0xff, // High byte of destination port
                    Number(steamPort) & 0xff // Low byte of destination port
                ])
            ]);

            this.proxySocket.write(request);

            this.proxySocket.once('data', (response) => {
                if (response[1] !== 0x00) {
                    reject(new Error('SOCKS5 error remote host connection failed.'));
                    return;
                }
                resolve();
            });
        });
    }

    protected resetPayloadState(): void {
        this.payload.buffer = Buffer.alloc(0);
        this.payload.length = 0;
    }
}

function isIpAddress(hostname: string): boolean {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname); // Simple regex for IPv4
}

function isIpv6Address(hostname: string): boolean {
    return /^[0-9a-fA-F:]+$/.test(hostname); // Simple regex for IPv6
}
