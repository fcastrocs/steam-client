/**
 * Manages high-level Steam operations
 */
import Long from 'long';
import EventEmitter from 'events';
import Auth from './services/Auth';
import Credentials from './services/Credentials';
import Player from './services/Player';
import Econ from './services/Econ';
import TCPConnection from './connections/TCPConn';
import WebSocketConnection from './connections/WebsocketConn';
import { ConnectionOptions } from './connections/Base';
import Store from './services/Store';

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
    getObfustucatedIp(): number;
    /**
     * Generate obfustucated Ip
     */
    protected obfustucateIp(): Promise<number>;
}
