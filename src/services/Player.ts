import { Game } from "../../@types/client.js";
import { GetOwnedGamesRes } from "../../@types/protoResponse.js";
import IPlayer from "../../@types/services/player.js";
import Steam from "../Steam.js";

export default class Player implements IPlayer {
  private readonly serviceName = "Player";
  constructor(private steam: Steam) { }

  async getOwnedGames(options?: { appidsFilter?: number[]; includePlayedFreeGames?: boolean }) {
    const res = await this.steam.conn.sendUnified(this.serviceName, "GetOwnedGames", {
      steamid: this.steam.steamId,
      appidsFilter: options && options.appidsFilter ? options.appidsFilter : undefined,
      includePlayedFreeGames: options && options.includePlayedFreeGames ? options.includePlayedFreeGames : undefined,
      includeAppinfo: true,
    });

    const games = res.games as GetOwnedGamesRes[];

    return games.map((game) => {
      return {
        gameid: game.appid,
        name: game.name,
        playtime: game.playtimeForever,
        icon: game.imgIconUrl,
      };
    }) as Game[];
  }
}
