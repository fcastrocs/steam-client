import { Language } from "../src/resources.js";
import { Game } from "../@types/steam.js";

export default interface IActions {
  changePlayerName(playerName: string): void;
  changePersonaState(state: keyof typeof Language.EPersonaState): void;
  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  idleGames(gameIds: number[], options?: { forcePlay?: boolean }): Promise<void>;
  /**
   * Activate cdkey
   */
  cdkeyRedeem(cdkey: string): Promise<Game[]>;
  /**
   * Activate free games
   */
  activateFreeToPlayGames(appids: number[]): Promise<Game[]>;
}
