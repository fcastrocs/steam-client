/**
 * Low-level Steam functionality
 */
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Player from "./services/Player.js";
import Econ from "./services/Econ.js";
import Store from "./services/Store.js";
import TCPConnection from "./connections/TCPConn.js";
import EventEmitter from "events";
import WebSocketConnection from "./connections/WebsocketConn.js";
import type { ConnectionOptions } from "../@types/connections/Base.js";
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
    private _obfustucatedIp;
    constructor(options: ConnectionOptions);
    disconnect(): void;
    get isLoggedIn(): boolean;
    get steamId(): import("long").default;
    /**
     * Access obfustucated Ip
     */
    get obfustucatedIp(): number;
    /**
     * Generate obfustucated Ip
     */
    protected obfustucateIp(): Promise<number>;
    private createMachineName;
    private createMachineId;
}
