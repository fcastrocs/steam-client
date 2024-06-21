/* eslint-disable import/prefer-default-export */
/**
 * Manages high-level Steam operations
 */
import EventEmitter from 'events';
import Long from 'long';
import { Auth } from './services/Auth.js';
import { Credentials } from './services/Credentials.js';
import { Player } from './services/Player.js';
import { Econ } from './services/Econ.js';
import { Store } from './services/Store.js';
import { TCPConnection } from './connections/TCPConnection.js';
import { WebSocketConnection } from './connections/WebSocketConnection.js';
import { ConnectionOptions } from './connections/Base.js';
import { RememberedMachine } from './all-types.js';

export abstract class Steam extends EventEmitter {
    private options;

    readonly service: {
        auth: Auth;
        credentials: Credentials;
        player: Player;
        econ: Econ;
        store: Store;
    };

    rememberedMachine: RememberedMachine;

    readonly conn: WebSocketConnection | TCPConnection;

    protected loggedIn: boolean;

    private obfustucatedIp;

    constructor(options: ConnectionOptions);

    /**
     * Connect to Steam
     */
    connect(): Promise<void>;

    disconnect(): void;

    get isLoggedIn(): boolean;

    get steamId(): Long;
    /**
     * Access obfustucated Ip
     */
    protected getObfustucatedIp(): number;

    private generateRememberedMachine(): void;
}
