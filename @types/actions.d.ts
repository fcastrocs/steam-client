import { Language } from "./resources.js";
import { Game } from "../@types/steam.js";

export default interface IActions {
  changePlayerName(playerName: string): void;
  changePersonaState(state: keyof typeof Language.EPersonaState): void;
  /**
   * Idle an array of appIds
   * empty array stops idling
   */
  idleGames(gameIds: number[]): void;
  /**
   * Activate cdkey
   */
  cdkeyRedeem(cdkey: string): Promise<Game[]>;
  /**
   * Activate free games
   */
  activateFreeToPlayGames(appids: number[]): Promise<Game[]>;
}
