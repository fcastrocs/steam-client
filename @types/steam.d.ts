/**
 * Manages high-level Steam operations
 */
import type Auth from "./services/auth.js";
import type Credentials from "./services/credentials.js";
import type Player from "./services/player.js";
import type Econ from "./services/Econ.js";
import type Connection, { ConnectionOptions } from "./connection.js";
import type { EResult } from "./enums/EResult.js";
import type TCPConnection from "./connections/TCPConn.js";
import type WebSocketConnection from "./connections/WebsocketConn.js";
import type Long from "long";

declare abstract class Steam extends EventEmitter {
  on(event: "ClientLoggedOff", listener: (eresult: keyof EResult) => void): this;
  once(event: "ClientLoggedOff", listener: (eresult: keyof EResult) => void): this;

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
  protected personaName: string;
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

export default Steam;
