/* eslint-disable import/prefer-default-export */
import { Steam, CPlayerGetOwnedGamesResponse } from '../all-types.js';

export class Player {
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
