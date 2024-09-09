import { IterableElement, Merge, ValueOf } from 'type-fest';
import {
    Steam,
    CMsgClientIsLimitedAccount,
    CMsgClientAccountInfo,
    CMsgClientLogOnResponse,
    CAuthenticationPollAuthSessionStatusResponse,
    CMsgClientVACBanStatus,
    QrCode,
    CMsgClientPersonaState,
    CPlayerGetOwnedGamesResponse,
    CMsgClientEmailAddrInfo,
    CMsgClientPlayingSessionState
} from './all-types.js';

declare const EPersonaState: typeof import('../resources/language/enums.steamd.js').EPersonaState;

export class Client extends Steam {
    on(event: 'PersonaState', listener: (state: Friend) => void): this;
    once(event: 'PersonaState', listener: (state: Friend) => void): this;
    on(event: 'PlayingSessionState', listener: (state: CMsgClientPlayingSessionState) => void): this;
    once(event: 'PlayingSessionState', listener: (state: CMsgClientPlayingSessionState) => void): this;
    on(event: 'disconnected', listener: (error: Error) => void): this;
    once(event: 'disconnected', listener: (error: Error) => void): this;
    on(event: 'authTokens', listener: (authTokens: CAuthenticationPollAuthSessionStatusResponse) => void): this;
    once(event: 'authTokens', listener: (authTokens: CAuthenticationPollAuthSessionStatusResponse) => void): this;
    on(event: 'qrCode', listener: (qrCode: QrCode) => void): this;
    once(event: 'qrCode', listener: (error: QrCode) => void): this;

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
