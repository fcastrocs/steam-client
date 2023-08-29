import type Steam from "../steam.js";

declare class Store {
  constructor(private steam: Steam);
  registerCDKey(activationCode: string): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}

export default Store;
