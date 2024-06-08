/* eslint-disable import/prefer-default-export */
import type Steam from '../Steam.js';
import type { CPlayerGetOwnedGamesResponse } from '../protos/steammessages_player.steamclient.js';

export class Store {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
