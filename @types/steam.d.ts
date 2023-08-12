/**
 * Manages high-level Steam operations
 */
import Auth from "./services/auth.js";
import Credentials from "./services/credentials.js";
import Player from "./services/player.js";
import Econ from "./services/Econ.js";
import Connection, { ConnectionOptions } from "./connection.js";
import { EResult } from "./enums/EResult.js";

export interface LoginOptions {
  accountName: string;
  password?: string;
  refreshToken?: string;
  machineName?: string;
}

export interface LoginOptionsExtended extends LoginOptions {
  accountName: string;
  accessToken: string;
  machineName?: string;
  clientOsType: number;
  shouldRememberPassword: boolean;
  protocolVersion: 65580;
  supportsRateLimitResponse: true;
}

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
  protected loggedIn = false;
  protected personaName: string;
  public readonly conn: WebSocketConnection | TCPConnection
  
  constructor(options: ConnectionOptions);
  /**
   * Disconnect user from Steam and kill connection
   */
  disconnect(): void;
  /**
   * Whether user is logged in
   */
  get isLoggedIn(): boolean;
  /**
   * returns account's steamId
   */
  get steamId(): Long;
}

export default Steam;
