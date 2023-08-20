/**
 * Manages high-level Steam operations
 */
import Auth from "./services/auth.js";
import Credentials from "./services/credentials.js";
import Player from "./services/player.js";
import Econ from "./services/Econ.js";
import Connection, { ConnectionOptions } from "./connection.js";
import { EResult } from "./enums/EResult.js";

declare abstract class Steam extends Connection {
  on(event: "ClientLoggedOff", listener: (eresult: keyof EResult) => void): this;
  once(event: "ClientLoggedOff", listener: (eresult: keyof EResult) => void): this;

  readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };
  readonly machineName: string;
  readonly machineId: Buffer;
  readonly conn: WebSocketConnection | TCPConnection;
  protected loggedIn: boolean;
  protected personaName: string;

  constructor(private options: ConnectionOptions);
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
