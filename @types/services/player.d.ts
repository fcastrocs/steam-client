import { CPlayer_GetOwnedGames_Response } from '../protos/steammessages_player.steamclient.js';
import Steam from '../Steam.js';

export default class Player {
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayer_GetOwnedGames_Response['games']>;
}
