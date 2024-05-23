import { CCredentialsGetSteamGuardDetailsResponse } from '../protos/steammessages_credentials.steamclient';
import type Steam from '../Steam';

export default class Credentials {
    private steam;

    private readonly serviceName;
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse>;
}
