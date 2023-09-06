export default class Player {
    constructor(steam) {
        this.steam = steam;
        this.serviceName = "Player";
    }
    async getOwnedGames(options) {
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetOwnedGames", {
            steamid: this.steam.steamId,
            appidsFilter: options && options.appidsFilter ? options.appidsFilter : undefined,
            includePlayedFreeGames: options && options.includePlayedFreeGames ? options.includePlayedFreeGames : undefined,
            includeAppinfo: true,
        });
        return res.games.map((game) => {
            return {
                gameid: game.appid,
                name: game.name,
                playtime: game.playtimeForever,
                icon: game.imgIconUrl,
            };
        });
    }
}
