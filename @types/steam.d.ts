/**
 * Manages high-level Steam operations
 */
import Auth, { AuthTokens, Confirmation } from "./services/auth.js";
import Credentials from "./services/credentials.js";
import Player from "./services/player.js";
import Econ, { Item } from "./services/Econ.js";
import Client from "./client.js";
import Connection, { ConnectionOptions } from "./connection.js";
import { ClientPlayingSessionState, Friend } from "./protoResponse.js";
import { SteamClientError } from "./common.js";
import EResultType from "./EResult.js";

declare const EResult: EResultType;

// expose the following types and constants
export { SteamClientError, AuthTokens, Confirmation, ConnectionOptions, EResult };

export interface LoginOptions {
  accountName: string;
  refreshToken: string;
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

export interface AccountAuth {
  machineName: string;
}

export interface AccountData {
  steamId: string;
  limited: boolean;
  vac: boolean;
  communityBanned: boolean;
  locked: boolean;
  games: Game[];
  emailOrDomain: string;
  isEmailVerified: boolean;
  credentialChangeRequiresCode: boolean;
  personaState: Friend;
  playingState: ClientPlayingSessionState;
  inventory: {
    steam: Item[];
  };
}

export interface Game {
  name: string;
  gameid: number;
  icon: string;
  playtime: number;
}

declare class Steam extends Connection {
  on(event: "accountLoggedOff", listener: (eresult: string) => void): this;
  on(event: "personaStateChanged", listener: (state: Friend) => void): this;
  on(event: "playingStateChanged", listener: (state: ClientPlayingSessionState) => void): this;
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;

  readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };
  readonly client: Client;
  readonly machineName: string;

  constructor(options: ConnectionOptions);
  /**
   * login to steam via credentials or refresh_token
   */
  login(options: LoginOptions): Promise<{
    auth: AccountAuth;
    data: AccountData;
  }>;
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
