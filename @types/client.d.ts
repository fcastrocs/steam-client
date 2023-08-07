import { ConnectionOptions, Game } from "./steam.js";
import { ClientPlayingSessionState, Friend } from "./protoResponse.js";

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

declare class Client {
  on(event: "accountLoggedOff", listener: (eresult: string) => void): this;
  on(event: "personaStateChanged", listener: (state: Friend) => void): this;
  on(event: "playingStateChanged", listener: (state: ClientPlayingSessionState) => void): this;
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;

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
