import { CPlayer_GetOwnedGames_Response } from "../protos/steammessages_player.steamclient.js";
import Steam from "../Steam.js";

declare class Credentials {
    constructor(steam: Steam);
    registerCDKey(activationCode: string): Promise<CPlayer_GetOwnedGames_Response["games"]>;
}

export default Credentials;
