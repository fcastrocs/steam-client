import Steam, { Game } from "./steam.js";
import { ClientPlayingSessionState, Friend } from "./protoResponse.js";

export interface EPersonaState {
  Offline: 0;
  Online: 1;
  Busy: 2;
  Away: 3;
  Snooze: 4;
  LookingToTrade: 5;
  LookingToPlay: 6;
  Invisible: 7;
}

declare class Client {
  constructor(steam: Steam);
  /**
   * Change player nickname
   */
  setPlayerName(playerName: string): Promise<Friend>;
  /**
   * Change player persona state
   */
  setPersonaState(personaState: keyof EPersonaState): Promise<Friend>;
  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  gamesPlayed(
    gameIds: number[],
    options?: {
      forcePlay?: boolean;
    }
  ): Promise<void>;
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
  private getAvatar;
  /**
   * Change player name or persona state
   */
  private changeStatus;
  /**
   * Get all appIds from packages
   */
  private getAppIds;
}

export default Client;
