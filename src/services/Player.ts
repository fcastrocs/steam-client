import Long from "long";
import { GetOwnedGamesRes } from "../../@types/protoResponse.js";
import IPlayer from "../../@types/services/player.js";
import { Game } from "../../@types/steam.js";
import Steam from "../Steam.js";

export default class Player implements IPlayer {
  private readonly serviceName = "Player";
  constructor(private steam: Steam) {}

  async getOwnedGames(steamid: Long, appidsFilter?: number[]) {
    const games = (
      await this.steam.sendUnified(this.serviceName, "GetOwnedGames", {
        steamid,
        appidsFilter,
        includeAppinfo: true,
      })
    ).games as GetOwnedGamesRes[];

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
