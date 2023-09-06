import { CPlayer_GetOwnedGames_Response } from "../protos/steammessages_player.steamclient.js";
import Steam from "../Steam.js";

declare class Player {
    constructor(steam: Steam);
    getOwnedGames(options?: { appidsFilter?: number[]; includePlayedFreeGames?: boolean }): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}
export default Player;
