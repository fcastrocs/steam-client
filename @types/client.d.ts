import { ConnectionOptions } from "./connections/Base.js";
import Steam from "./Steam.js";
import { Item } from "./services/Econ.js";
import { IterableElement, Merge } from "type-fest";
import { CMsgClientPersonaState } from "./protos/steammessages_clientserver_friends.js";
import { CPlayer_GetOwnedGames_Response } from "./protos/steammessages_player.steamclient.js";
import { SteamClientError } from "./index.js";
import { EResult } from "../resources/language/EResult.ts";
import { EPersonaState } from "../resources/language/enums.steamd.ts";
import { CMsgClientPlayingSessionState } from "./protos/steammessages_clientserver_2.js";

export type LoginOptions = {
    accountName?: string;
    password?: string;
    refreshToken?: string;
    machineName?: string;
    machineId?: Buffer;
};

export interface AccountAuth {
    machineName: string;
}

export interface AccountData {
    steamId: string;
    limited: boolean;
    vac: boolean;
    communityBanned: boolean;
    locked: boolean;
    games: CPlayer_GetOwnedGames_Response["games"];
    emailOrDomain: string;
    isEmailVerified: boolean;
    credentialChangeRequiresCode: boolean;
    personaState: Friend;
    playingState: CMsgClientPlayingSessionState;
    inventory: {
        steam: Item[];
    };
}

export type Friend = Merge<IterableElement<CMsgClientPersonaState["friends"]>, { avatarString?: string }>;

declare class Client extends Steam {
    on(event: "ClientPersonaState", listener: (state: Friend) => void): this;
    once(event: "ClientPersonaState", listener: (state: Friend) => void): this;
    on(event: "ClientPlayingSessionState", listener: (state: CMsgClientPlayingSessionState) => void): this;
    once(event: "ClientPlayingSessionState", listener: (state: CMsgClientPlayingSessionState) => void): this;
    on(event: "disconnected", listener: (error: SteamClientError) => void): this;
    once(event: "disconnected", listener: (error: SteamClientError) => void): this;

    on(event: "ClientLoggedOff", listener: (eresult: EResult) => void): this;
    once(event: "ClientLoggedOff", listener: (eresult: EResult) => void): this;

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
    gamesPlayed(
        gameIds: number[],
        options?: {
            forcePlay?: boolean;
        }
    ): Promise<void>;
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
}

export default Client;
