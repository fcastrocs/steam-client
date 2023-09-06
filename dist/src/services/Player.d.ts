import Steam from "../Steam.js";
import type { CPlayer_GetOwnedGames_Response } from "../../@types/protos/steammessages_player.steamclient.js";
export default class Player {
    private steam;
    private readonly serviceName;
    constructor(steam: Steam);
    getOwnedGames(options?: {
        appidsFilter?: number[];
        includePlayedFreeGames?: boolean;
    }): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}
