/**
 * Handle websocket connection to steam
 */

import WebSocket, { ClientOptions } from 'ws';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Base from './Base.js';
import { SteamClientError } from '../modules/common.js';
import { ConnectionOptions } from '../../@types/connections/Base.js';
import Language from '../modules/language.js';

const { EMsg } = Language;

export default class WebSocketConnection extends Base {
    private ws: WebSocket;

    constructor(protected options: ConnectionOptions) {
        super(options);

        // send data to Steam
        this.on('sendData', (message: Buffer) => this.ws.send(message));
    }

    public async connect(): Promise<void> {
        // set proxy agent if proxy was specified
        const wsOptions: ClientOptions = {
            agent: !this.options.proxy
                ? undefined
                : this.options.proxy.type === 'socks'
                  ? new SocksProxyAgent(
                        `socks://${this.options.proxy.user}:${this.options.proxy.pass}@${this.options.proxy.host}:${this.options.proxy.port}`
                    )
                  : new HttpsProxyAgent(
                        `http://${this.options.proxy.user}:${this.options.proxy.pass}@${this.options.proxy.host}:${this.options.proxy.port}`
                    )
        };

        const wsURL =
            'wss://' +
            `${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`;
        this.ws = new WebSocket(wsURL, { ...wsOptions });

        // received data from steam
        this.ws.on('message', (data, isBinary) => {
            if (!isBinary) {
                return this.destroyConnection(
                    new SteamClientError('Data received was not binary.')
                );
            }

            this.decodeData(data as Buffer);
        });

        return new Promise((resolve, reject) => {
            // expect connection handshake before timeout. This will trigger "error" event
            const timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                reject(
                    new SteamClientError(
                        'Could not connect to Steam WS (timeout)'
                    )
                );
            }, this.timeout);

            const errorListener = (error: Error) => {
                clearTimeout(timeoutId);
                reject(new SteamClientError(error.message));
            };

            this.ws.once('error', errorListener);

            // successfully connected
            this.ws.once('open', () => {
                clearTimeout(timeoutId);
                this.ws.removeListener('error', errorListener);
                this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });
                // register needed events
                this.registerEvents();
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
