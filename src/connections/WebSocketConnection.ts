/**
 * Handle websocket connection to steam
 */

import WebSocket from 'ws';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Agent } from 'http';
import Base from './Base.js';
import { SteamClientError } from '../modules/common.js';
import Language from '../modules/language.js';
import type { ConnectionOptions } from '../../@types/index.js';

const { EMsg } = Language;

export default class WebSocketConnection extends Base {
    private ws: WebSocket;

    constructor(protected options: ConnectionOptions) {
        super(options);

        // send data to Steam
        this.on('sendData', (message: Buffer) => this.ws.send(message));
    }

    public async connect(): Promise<void> {
        if (this.isConnected()) throw new SteamClientError('Client is already connected to Steam.');

        const agent = this.getProxyAgent();
        const wsURL = `wss://${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`;
        this.ws = new WebSocket(wsURL, { agent });

        // received data from steam
        this.ws.on('message', (data, isBinary) => {
            if (!isBinary) {
                this.destroyConnection(new SteamClientError('Data received was not binary.'));
            } else {
                this.decodeData(data as Buffer);
            }
        });

        return this.awaitConnection();
    }

    private getProxyAgent(): Agent | undefined {
        if (!this.options.proxy) {
            return undefined;
        }

        const { proxy } = this.options;
        const proxyUrl = `${proxy.user}:${proxy.pass}@${proxy.host}:${proxy.port}`;

        return proxy.type === 'socks' ? new SocksProxyAgent(`socks://${proxyUrl}`) : new HttpsProxyAgent(`http://${proxyUrl}`);
    }

    private awaitConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new SteamClientError('Could not connect to Steam WS (timeout)'));
            }, this.timeout);

            const errorListener = (error: Error) => {
                clearTimeout(timeoutId);
                reject(new SteamClientError(error.message));
            };

            this.ws.once('error', errorListener);

            this.ws.once('open', () => {
                clearTimeout(timeoutId);
                this.ws.removeListener('error', errorListener);
                this.establishedConn = true;
                this.registerEvents();
                this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });
                resolve();
            });
        });
    }

    public destroyConnection(error?: SteamClientError) {
        super.destroyConnection(error);
        if (this.ws) {
            this.removeAllListeners();
            this.ws.terminate();
        }
    }

    private registerEvents() {
        this.ws.once('close', (code) => {
            if (!this.isLoggedIn()) return;
            // not normal close
            if (code !== 1000) {
                this.destroyConnection(new SteamClientError(code.toString()));
            }
        });

        this.ws.on('error', (error) => {
            if (!this.isLoggedIn()) return;
            this.destroyConnection(new SteamClientError(error.message));
        });
    }
}
