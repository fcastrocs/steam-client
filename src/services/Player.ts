import type { CPlayerGetOwnedGamesResponse, CPlayerGetOwnedGamesRequest } from '../../@types/index.js';
import Steam from '../Steam.js';

export default class Player {
    private readonly serviceName = 'Player';

    constructor(private steam: Steam) {}

    async getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayerGetOwnedGamesResponse['games']> {
        const res: CPlayerGetOwnedGamesResponse = await this.steam.sendServiceMethodCall(this.serviceName, 'GetOwnedGames', {
            steamid: this.steam.steamId,
            appidsFilter: options && options.appidsFilter ? options.appidsFilter : undefined,
            includePlayedFreeGames: options && options.includePlayedFreeGames ? options.includePlayedFreeGames : undefined,
            includeAppinfo: true
        } as CPlayerGetOwnedGamesRequest);

        if (!res.games) return [];

        return res.games.map((game) => ({
            gameid: game.appid,
            name: game.name,
            playtime: game.playtimeForever,
            icon: game.imgIconUrl
        }));
    }
}
