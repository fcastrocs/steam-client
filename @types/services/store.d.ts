import type Steam from '../Steam';
import type { CPlayerGetOwnedGamesResponse } from '../protos/steammessages_player.steamclient';

export default class Credentials {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
