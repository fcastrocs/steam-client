import { CCredentialsGetSteamGuardDetailsResponse } from '../../@types/protos/steammessages_credentials.steamclient.js';
import type Steam from '../Steam.js';

export default class Credentials {
    private readonly serviceName = 'Credentials';

    constructor(private steam: Steam) {}

    async getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse> {
        return this.steam.conn.sendServiceMethodCall(this.serviceName, 'GetSteamGuardDetails', {});
    }
}
