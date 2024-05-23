import { CPlayer_GetOwnedGames_Response } from '../protos/steammessages_player.steamclient';
import Steam from '../Steam';

export default class Credentials {
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayer_GetOwnedGames_Response['games']>;
}
