import { CPlayerGetOwnedGamesResponse } from '../protos/steammessages_player.steamclient';
import type Steam from '../Steam';

export default class Player {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
