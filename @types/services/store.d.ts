/* eslint-disable import/prefer-default-export */
import { Steam, CPlayerGetOwnedGamesResponse } from '../all-types.js';

export class Store {
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayerGetOwnedGamesResponse['games']>;
}
