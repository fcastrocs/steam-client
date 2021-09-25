/// <reference types="node" />
/// <reference types="long" />
export interface LooseObject {
    [key: string]: any;
}
export interface LoginOptions {
    accountName: string;
    password?: string;
    machineName?: string;
    clientOsType?: number;
    shouldRememberPassword?: true;
    twoFactorCode?: string;
    loginKey?: string;
    shaSentryfile?: Buffer;
    authCode?: string;
    protocolVersion?: 65580;
    supportsRateLimitResponse?: true;
    machineId?: Buffer;
}
export declare type Sentry = Buffer;
export interface PackageInfo {
    packageid: number;
    billingtype: number;
    licensetype: number;
    appids: number[];
}
export interface AppInfo {
    appid: string;
    common: {
        clienticon: string;
        icon: string;
        logo: string;
        logo_small: string;
        name: string;
        type: string;
    };
}
export interface Game {
    name: string;
    appid: string;
    logo: string;
}
export interface AccountAuth {
    sentry: Buffer;
    loginKey: string;
    machineName: string;
    webNonce: string;
}
export interface AccountData {
    steamId: string;
    limited: boolean;
    vac: boolean;
    avatar: string;
    nickname: string;
    communityBanned: boolean;
    locked: boolean;
    games: Game[];
}
export interface ChangeStatusOption {
    personaState?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    playerName?: string;
}
export interface GamesPlayedOption extends LooseObject {
    gamesPlayed: {
        gameId: number;
    }[];
}
export interface RequestFreeLicenseOption extends LooseObject {
    appids: number[];
}
export interface CMsgProtoBufHeader {
    steamid: Long;
    clientSessionid: number;
    jobidSource: Long;
}
