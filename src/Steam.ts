/**
 * Low-level Steam functionality
 */

import EventEmitter from 'events';
import { randomBytes } from 'crypto';
import http from 'http';
import Auth from './services/Auth.js';
import Credentials from './services/Credentials.js';
import Player from './services/Player.js';
import Econ from './services/Econ.js';
import Store from './services/Store.js';
import Language from './modules/language.js';
import TCPConnection from './connections/TCPConn.js';
import WebSocketConnection from './connections/WebsocketConn.js';
import type { ConnectionOptions } from '../@types/connections/Base.js';

const { EResultMap } = Language;

export default abstract class Steam extends EventEmitter {
    readonly service: {
        auth: Auth;
        credentials: Credentials;
        player: Player;
        econ: Econ;
        store: Store;
    };

    readonly machineName: string;

    readonly machineId: Buffer;

    readonly conn: WebSocketConnection | TCPConnection;

    protected loggedIn: boolean;

    private _obfustucatedIp: number;

    constructor(private options: ConnectionOptions) {
        super();

        // create connection
        if (options.type === 'ws') {
            this.conn = new WebSocketConnection(options);
        } else if (options.type === 'tcp') {
            this.conn = new TCPConnection(options);
        }

        // inject dependencies
        this.service = {
            auth: new Auth(this),
            credentials: new Credentials(this),
            player: new Player(this),
            econ: new Econ(this),
            store: new Store(this)
        };

        // create machine identity
        this.machineName = this.createMachineName();
        this.machineId = this.createMachineId();

        this.conn.once('ClientLoggedOff', (body) => {
            this.disconnect();
            this.emit('ClientLoggedOff', EResultMap.get(body.eresult));
        });
    }

    public disconnect() {
        this.conn.destroyConnection();
    }

    public get isLoggedIn() {
        return this.conn.isLoggedIn();
    }

    public get steamId() {
        return this.conn.steamid;
    }

    /**
     * Access obfustucated Ip
     */
    public get obfustucatedIp() {
        return this._obfustucatedIp;
    }

    /**
     * Generate obfustucated Ip
     */
    protected async obfustucateIp(): Promise<number> {
        if (this._obfustucatedIp) return this._obfustucatedIp;

        const mask = 0x163d3530;
        let ip: string;

        // get ip
        if (this.options.proxy) {
            ip = this.options.proxy.host;
        } else {
            // get public ip
            ip = await new Promise((resolve) => {
                try {
                    const req = http
                        .get({ host: 'api.ipify.org' }, (res) => {
                            res.once('data', (data) => {
                                req.destroy();
                                resolve(data.toString());
                            });
                        })
                        .setTimeout(1000);

                    req.once('error', (error) => {
                        console.debug(error);
                        resolve('');
                    });

                    req.once('timeout', () => {
                        console.debug('api.ipify.org request timed out.');
                        resolve('');
                    });
                } catch (error) {
                    console.debug('api.ipify.org request timed out.');
                    resolve('');
                }
            });
        }

        // could not get ip
        if (!ip) return 0;

        const ipInt =
            ip
                .split('.')
                .reduce(
                    (ipInt, octet) => (ipInt << 8) + parseInt(octet, 10),
                    0
                ) >>> 0;

        this._obfustucatedIp = ipInt ^ mask;
        return this._obfustucatedIp;
    }

    private createMachineName(): string {
        const name = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substring(0, 5)
            .toUpperCase();
        return `DESKTOP-${name}-IDLE`;
    }

    private createMachineId(): Buffer {
        const hexBB3 = Buffer.from(randomBytes(20).toString('hex')).toString(
            'hex'
        );
        const hexFF2 = Buffer.from(randomBytes(20).toString('hex')).toString(
            'hex'
        );
        const hex3B3 = Buffer.from(randomBytes(20).toString('hex')).toString(
            'hex'
        );
        return Buffer.from(
            `004D6573736167654F626A656374000142423300${hexBB3}000146463200${hexFF2}000133423300${hex3B3}000808`,
            'hex'
        );
    }
}
