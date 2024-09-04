import type { CCredentialsGetSteamGuardDetailsResponse } from '../../@types/index.js';
import Steam from '../Steam.js';

export default class Credentials {
    private readonly serviceName = 'Credentials';

    constructor(private steam: Steam) {}

    async getSteamGuardDetails(): Promise<CCredentialsGetSteamGuardDetailsResponse> {
        return this.steam.sendServiceMethodCall(this.serviceName, 'GetSteamGuardDetails', {});
    }
}
