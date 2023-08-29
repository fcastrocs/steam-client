import type Steam from "../steam.js";

declare class Player {
  constructor(private steam: Steam);
  getOwnedGames(options?: { appidsFilter?: number[]; includePlayedFreeGames?: boolean }): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}

export default Player;
