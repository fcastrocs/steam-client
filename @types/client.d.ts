import type { ConnectionOptions } from "./connection.js";
import type Steam, { LoginOptions } from "./steam.js";
import type { EPersonaState } from "./enums/commons.js";
import type { Item } from "./services/econ.js";
import type { SteamClientError } from "./common.js";
import type { IterableElement } from "type-fest";

export type LoginOptions = {
  accountName?: string;
  password?: string;
  refreshToken?: string;
  machineName?: string;
  machineId?: Buffer;
};

export interface AccountAuth {
  machineName: string;
}

export interface AccountData {
  steamId: string;
  limited: boolean;
  vac: boolean;
  communityBanned: boolean;
  locked: boolean;
  games: CPlayer_GetOwnedGames_Response["games"];
  emailOrDomain: string;
  isEmailVerified: boolean;
  credentialChangeRequiresCode: boolean;
  personaState: Friend;
  playingState: CMsgClientPlayingSessionState;
  inventory: {
    steam: Item[];
  };
}

export type Friend = IterableElement<CMsgClientPersonaState["friends"]> & { avatarString?: string };

declare class Client extends Steam {
  on(event: "ClientPersonaState", listener: (state: Friend) => void): this;
  once(event: "ClientPersonaState", listener: (state: Friend) => void): this;
  on(event: "ClientPlayingSessionState", listener: (state: CMsgClientPlayingSessionState) => void): this;
  once(event: "ClientPlayingSessionState", listener: (state: CMsgClientPlayingSessionState) => void): this;
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  once(event: "disconnected", listener: (error: SteamClientError) => void): this;

  constructor(options: ConnectionOptions);
  /**
   * login to steam via credentials or refresh_token
   */
  login(options: LoginOptions): Promise<{
    auth: AccountAuth;
    data: AccountData;
  }>;
  /**
   * Change player nickname
   */
  setPlayerName(playerName: string): Promise<Friend>;
  /**
   * Change player persona state
   */
  setPersonaState(personaState: keyof typeof EPersonaState): Promise<Friend>;
  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  gamesPlayed(gameIds: number[], options?: { forcePlay?: boolean }): Promise<void>;
  /**
   * Activate free games
   */
  requestFreeLicense(appids: number[]): Promise<CPlayer_GetOwnedGames_Response["games"]>;
  /**
   * Whether playing is blocked by another session
   */
  get isPlayingBlocked(): boolean;
  /**
   * Whether account is playing a game
   */
  get isPlayingGame(): boolean;
  get playingSessionState(): CMsgClientPlayingSessionState;
}

export default Client;
