import Steam from "../Steam.js";

export default class Player {
  private readonly serviceName = "Player";
  constructor(private steam: Steam) {}

  async getOwnedGames(options?: { appidsFilter?: number[]; includePlayedFreeGames?: boolean }): Promise<CPlayer_GetOwnedGames_Response["games"]> {
    const res: CPlayer_GetOwnedGames_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetOwnedGames", {
      steamid: this.steam.steamId,
      appidsFilter: options && options.appidsFilter ? options.appidsFilter : undefined,
      includePlayedFreeGames: options && options.includePlayedFreeGames ? options.includePlayedFreeGames : undefined,
      includeAppinfo: true,
    } as CPlayer_GetOwnedGames_Request);

    return res.games!.map((game) => {
      return {
        gameid: game.appid,
        name: game.name,
        playtime: game.playtimeForever,
        icon: game.imgIconUrl,
      };
    });
  }
}
