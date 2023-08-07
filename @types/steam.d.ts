/**
 * Manages high-level Steam operations
 */
import Auth, { AuthTokens, Confirmation } from "./services/auth.js";
import Credentials from "./services/credentials.js";
import Player from "./services/player.js";
import Econ from "./services/Econ.js";
import Connection, { ConnectionOptions } from "./connection.js";
import { SteamClientError } from "./common.js";

// expose the following types and constants
export { SteamClientError, AuthTokens, Confirmation, ConnectionOptions, EResult };

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
  readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };

  readonly machineName: string;
  protected loggedIn = false;
  protected personaName: string;
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
