import { ConnectionOptions } from "./connection.js";
import Steam, { LoginOptions } from "./steam.js";
import { EPersonaState } from "./enums/commons.js"
import { Item } from "./services/Econ.js";
import { SteamClientError } from "./common.js";

// expose constants
import { EResult as EResultType } from "./enums/EResult.js";
import { EMsg as EMsgType } from "./enums/enums_clientserver.proto.js";
import { ClientPlayingSessionState, Friend } from "./protos/client.protos.js";
declare const EResult: EResultType;
declare const EMsg: EMsgType;
export { EResult, EMsg, SteamClientError }

export type LoginOptions = {
  accountName?: string;
  password?: string;
  refreshToken?: string;
  machineName?: string;
  machineId?: Buffer;
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

declare class Client extends Steam {
  on(event: "ClientPersonaState", listener: (state: Friend) => void): this;
  once(event: "ClientPersonaState", listener: (state: Friend) => void): this;
  on(event: "ClientPlayingSessionState", listener: (state: ClientPlayingSessionState) => void): this;
  once(event: "ClientPlayingSessionState", listener: (state: ClientPlayingSessionState) => void): this;

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
  gamesPlayed(gameIds: number[], options?: {
    forcePlay?: boolean;
  }): Promise<void>;
  /**
   * Activate cdkey
   */
  registerKey(cdkey: string): Promise<Game[]>;
  /**
   * Activate free games
   */
  requestFreeLicense(appids: number[]): Promise<Game[]>;
  /**
   * Whether playing is blocked by another session
   */
  get isPlayingBlocked(): boolean;
  /**
   * Whether account is playing a game
   */
  get isPlayingGame(): boolean;
  get playingSessionState(): ClientPlayingSessionState;
}

export default Client;
