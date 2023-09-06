import Steam from "../Steam.js";
import type { CPlayer_GetOwnedGames_Response } from "../../@types/protos/steammessages_player.steamclient.js";
export default class Credentials {
    private steam;
    private readonly serviceName;
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}
