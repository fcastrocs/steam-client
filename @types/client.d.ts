import { Game } from "./steam.js";
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

export default class IClient {
  on(event: "personaStateChanged", listener: (state: Friend) => void): this;
  on(event: "playingStateChanged", listener: (state: ClientPlayingSessionState) => void): this;

  private playingSessionState: ClientPlayingSessionState;
  private personaState: Friend;

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
  gamesPlayed(gameIds: number[], options?: { forcePlay?: boolean }): Promise<void>;
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
   * Whether user is playing a game
   */
  get isPlayingGame(): boolean;

  get playingSessionState(): ClientPlayingSessionState;
}
