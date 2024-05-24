/**
 * Manages high-level Steam operations
 */
import EventEmitter from 'events';
import Auth from './services/Auth.js';
import Credentials from './services/Credentials.js';
import Player from './services/Player.js';
import type Econ from './services/Econ.js';
import Store from './services/Store.js';
import TCPConnection from './connections/TCPConnection.js';
import WebSocketConnection from './connections/WebSocketConnection.js';
import type { ConnectionOptions } from './connections/Base.js';

export default abstract class Steam extends EventEmitter {
    private options;

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

    private obfustucatedIp;
    constructor(options: ConnectionOptions);
    disconnect(): void;
    get isLoggedIn(): boolean;
    get steamId(): import('long').default;
    /**
     * Access obfustucated Ip
     */
    getObfustucatedIp(): number;
}
