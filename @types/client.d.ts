import { IterableElement, Merge, ValueOf } from 'type-fest';
import { SteamClientError } from 'index.js';
import { Steam } from './Steam.js';
import { ConnectionOptions } from './connections/Base.js';
import { CMsgClientEmailAddrInfo, CMsgClientPlayingSessionState } from './protos/steammessages_clientserver_2.js';
import { CPlayerGetOwnedGamesResponse } from './protos/steammessages_player.steamclient.js';
import { CMsgClientPersonaState } from './protos/steammessages_clientserver_friends.js';
import { CMsgClientAccountInfo, CMsgClientLogOnResponse } from './protos/steammessages_clientserver_login.js';
import { CMsgClientIsLimitedAccount } from './protos/steammessages_clientserver.js';
import { Item } from './services/Econ.js';
import { CMsgClientVACBanStatus } from './all-types.js';
import { EResult } from '../resources/language/EResult.js';

declare const EPersonaState: typeof import('../resources/language/enums.steamd.js').EPersonaState;

export class Client extends Steam {
    on(event: 'ClientPersonaState', listener: (state: Friend) => void): this;
    once(event: 'ClientPersonaState', listener: (state: Friend) => void): this;
    on(event: 'ClientPlayingSessionState', listener: (state: CMsgClientPlayingSessionState) => void): this;
    once(event: 'ClientPlayingSessionState', listener: (state: CMsgClientPlayingSessionState) => void): this;
    on(event: 'disconnected', listener: (error: SteamClientError) => void): this;
    once(event: 'disconnected', listener: (error: SteamClientError) => void): this;
    on(event: 'ClientLoggedOff', listener: (eresult: keyof typeof EResult) => void): this;
    once(event: 'ClientLoggedOff', listener: (eresult: keyof typeof EResult) => void): this;

    private personaState;

    private playingSessionState;

    constructor(options: ConnectionOptions);
    /**
     * login to steam via credentials or refresh_token
     */
    login(options: LoginOptions): Promise<SteamAccount>;
    /**
     * Change player nickname
     */
    setPlayerName(playerName: string): Promise<Friend>;
    /**
     * Change player persona state
     */
    setPersonaState(personaState: ValueOf<typeof EPersonaState>): Promise<Friend>;
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
    ): Promise<CMsgClientPlayingSessionState>;
    /**
     * Activate free games
     */
    requestFreeLicense(appids: number[]): Promise<CPlayerGetOwnedGamesResponse['games']>;
    /**
     * Whether playing is blocked by another session
     */
    get isPlayingBlocked(): boolean;
    /**
     * Whether account is playing a game
     */
    get isPlayingGame(): boolean;
    getPlayingSessionState(): {
        playingBlocked?: boolean;
        playingApp?: number;
    };
    /**
     * Change player name or persona state
     */
    private changeStatus;
}

export type RememberedMachine = {
    name: string;
    id: Buffer;
};

export type LoginOptions = {
    accountName?: string;
    password?: string;
    refreshToken?: string;
    rememberedMachine?: RememberedMachine;
};

export interface SteamAccount {
    steamId: string;
    rememberedMachine: RememberedMachine;
    clientLogOnResponse: CMsgClientLogOnResponse;
    clientAccountInfo: CMsgClientAccountInfo;
    clientEmailAddrInfo: CMsgClientEmailAddrInfo;
    clientIsLimitedAccount: CMsgClientIsLimitedAccount;
    clientVACBanStatus: CMsgClientVACBanStatus;
    clientPersonaState: Friend;
    clientPlayingSessionState: CMsgClientPlayingSessionState;
    ownedGamesResponse: CPlayerGetOwnedGamesResponse['games'];
    inventory: {
        steam: Item[];
    };
}

export interface JsonWebToken {
    iss: string;
    sub: string;
    aud: string[];
    exp: number;
    nbf: number;
    iat: number;
    jti: string;
    oat: number;
    per: number;
    ip_subject: string;
    ip_confirmer: string;
}

export type Friend = Merge<IterableElement<CMsgClientPersonaState['friends']>, { avatarString?: string }>;
