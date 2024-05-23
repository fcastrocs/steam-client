import type Steam from '../Steam';
import type { CCredentials_GetSteamGuardDetails_Response } from '../../@types/protos/steammessages_credentials.steamclient.js';

export default class Credentials {
    private readonly serviceName = 'Credentials';

    constructor(private steam: Steam) {}

    async getSteamGuardDetails(): Promise<CCredentials_GetSteamGuardDetails_Response> {
        return this.steam.conn.sendServiceMethodCall(this.serviceName, 'GetSteamGuardDetails', {});
    }
}
