import { Game } from "../@types/steam.js";
import { ClientChangeStatus } from "./protoRequest.js";

interface State {
  personaState: number;
  playerName: string;
}

export default interface IActions {
  changeStatus(payload: ClientChangeStatus): Promise<Friend>;
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
