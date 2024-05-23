import { CCredentialsGetSteamGuardDetailsResponse } from '../protos/steammessages_credentials.steamclient';
import Steam from '../Steam.js';

export default class Credentials {
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse>;
}
