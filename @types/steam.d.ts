/**
 * Manages high-level Steam operations
 */
import Auth from './services/Auth.js';
import Credentials from './services/Credentials.js';
import Player from './services/Player.js';
import Econ from './services/Econ.js';
import TCPConnection from './connections/TCPConn.js';
import WebSocketConnection from './connections/WebsocketConn.js';
import { ConnectionOptions } from './connections/Base.js';
import Long from 'long';
import EventEmitter from 'events';
import Store from './services/Store.js';

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
    constructor(options: ConnectionOptions);
    disconnect(): void;
    get isLoggedIn(): boolean;
    get steamId(): Long;
    /**
     * Access obfustucated Ip
     */
    get obfustucatedIp(): number;
    /**
     * Generate obfustucated Ip
     */
    protected obfustucateIp(): Promise<number>;
}
