/**
 * Manages high-level Steam operations
 */
import EventEmitter from 'events';
import Auth from './services/Auth';
import Credentials from './services/Credentials';
import Player from './services/Player';
import type Econ from './services/Econ';
import Store from './services/Store';
import TCPConnection from './connections/TCPConnection';
import WebSocketConnection from './connections/WebSocketConnection';
import type { ConnectionOptions } from './connections/Base';

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
