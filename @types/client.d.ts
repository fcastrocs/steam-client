import { Game } from "./steam.js";
import { Friend } from "./protoResponse.js";

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
  on(event: "PersonaStateChanged", listener: (state: Friend) => void): this;
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
}
