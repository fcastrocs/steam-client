import { CPlayer_GetOwnedGames_Response } from '../protos/steammessages_player.steamclient';
import Steam from '../Steam';

export default class Player {
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayer_GetOwnedGames_Response['games']>;
}
