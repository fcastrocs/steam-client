/* eslint-disable import/prefer-default-export */
import { CCredentialsGetSteamGuardDetailsResponse } from '../protos/steammessages_credentials.steamclient.js';
import type Steam from '../Steam.js';

export class Credentials {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse>;
}
