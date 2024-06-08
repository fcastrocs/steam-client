/* eslint-disable import/prefer-default-export */
import { CPlayerGetOwnedGamesResponse } from '../protos/steammessages_player.steamclient.js';
import type Steam from '../Steam.js';

export class Player {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
