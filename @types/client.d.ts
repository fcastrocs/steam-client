import { Game } from "./steam.js";
import { ClientChangeStatus } from "./protoRequest.js";

interface State {
  personaState: number;
  playerName: string;
}

export default interface IClient {
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
  requestFreeLicense(appids: number[]): Promise<Game[]>;
}
