import Steam from "../Steam.js";
import type { CCredentials_GetSteamGuardDetails_Response } from "../../@types/protos/steammessages_credentials.steamclient.js";
export default class Credentials {
    private steam;
    private readonly serviceName;
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentials_GetSteamGuardDetails_Response>;
}
