import { CCredentials_GetSteamGuardDetails_Response } from "../protos/steammessages_credentials.steamclient.js";
import { CPlayer_GetOwnedGames_Response } from "../protos/steammessages_player.steamclient.js";
import Steam from "../Steam.js";

declare class Credentials {
    constructor(steam: Steam);
    getSteamGuardDetails(): Promise<CCredentials_GetSteamGuardDetails_Response>;
}

export default Credentials;
