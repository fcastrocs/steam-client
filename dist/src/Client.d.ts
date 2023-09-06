import Steam from "./Steam.js";
import { EPersonaState } from "../language/enums.steamd.js";
import type { AccountAuth, AccountData, Friend, LoginOptions } from "../@types/Client.js";
import type { ConnectionOptions } from "../@types/connections/Base.js";
import type { CMsgClientPlayingSessionState } from "../@types/protos/steammessages_clientserver_2.js";
import type { CPlayer_GetOwnedGames_Response } from "../@types/protos/steammessages_player.steamclient.js";
export default class Client extends Steam {
    private personaState;
    private firstPersonaName;
    private _playingSessionState;
    constructor(options: ConnectionOptions);
    /**
     * login to steam via credentials or refresh_token
     */
    login(options: LoginOptions): Promise<{
        auth: AccountAuth;
        data: AccountData;
    }>;
    /**
     * Change player nickname
     */
    setPlayerName(playerName: string): Promise<Friend>;
    /**
     * Change player persona state
     */
    setPersonaState(personaState: EPersonaState): Promise<Friend>;
    /**
     * Idle an array of appIds
     * Empty array stops idling
     * forcePlay truthy kicks another playing session
     */
    gamesPlayed(gameIds: number[], options?: {
        forcePlay?: boolean;
    }): Promise<void>;
    /**
     * Activate free games
     */
    requestFreeLicense(appids: number[]): Promise<CPlayer_GetOwnedGames_Response["games"]>;
    /**
     * Whether playing is blocked by another session
     */
    get isPlayingBlocked(): boolean;
    /**
     * Whether account is playing a game
     */
    get isPlayingGame(): boolean;
    get playingSessionState(): CMsgClientPlayingSessionState;
    private getAvatar;
    /**
     * Change player name or persona state
     */
    private changeStatus;
    private verifyRefreshToken;
}
