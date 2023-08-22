import { ValueOf } from "type-fest";
import { EOSType } from "../enums/commons";

interface CMsgClientLogon_Request {
    protocolVersion: number;
    cellId: number;
    clientPackageVersion: number;
    clientLanguage: string;
    clientOsType: ValueOf<EOSType>;
    shouldRememberPassword: boolean;
    obfuscatedPrivateIp: { ip: { v4: number } };
    qosLevel: number;
    machineId: buffer;
    accountName: string;
    password: string;
    machineName: string;
    supportsRateLimitResponse: boolean
    priorityReason: number;
    accessToken: string;
}

type CMsgClientGamesPlayed = {
    gamesPlayed: {
        gameId: Long;
    }[];
    clientOsType: ValueOf<EOSType>;
}

type ClientChangeStatus = {
    personaState?: number;
    playerName?: string;
}

type ClientLogonResponse = {
    eresult: number;
    heartbeatSeconds: number;
    rtime32ServerTime: number;
    accountFlags: number;
    cellId: number;
    webapiAuthenticateUserNonce: string;
    cellIdPingThreshold: number;
    vanityUrl: string;
    publicIp: { v4: number };
    clientSuppliedSteamid: Long;
    ipCountryCode: string;
    parentalSettings: Buffer;
    parentalSettingSignature: Buffer;
    countLoginfailuresToMigrate: number;
    countDisconnectsToMigrate: number;
    clientInstanceId: Long;
    forceClientUpdateCheck: boolean;
    tokenId: Long;
}

type ClientAccountInfo = {
    personaName: string;
    ipCountry: string;
    countAuthedComputers: number;
    accountFlags: number;
    twoFactorState: number;
}

type ClientEmailAddrInfo = {
    emailAddress: string;
    emailIsValidated: boolean;
    emailValidationChanged: boolean;
    credentialChangeRequiresCode: boolean;
    passwordOrSecretqaChangeRequiresCode: boolean;
    remindUserAboutEmail: boolean;
}

type ClientIsLimitedAccount = {
    bisLimitedAccount: boolean;
    bisCommunityBanned: boolean;
    bisLockedAccount: boolean;
    bisLimitedAccountAllowedToInviteFriends: boolean;
}

type Friend = {
    friendid: Long;
    personaState: number;
    gamePlayedAppId: number;
    personaStateFlags: number;
    onlineSessionInstances: number;
    playerName: string;
    steamidSource: Long;
    avatarHash: Buffer;
    avatarString: string;
    lastLogoff: number;
    lastLogon: number;
    lastSeenOnline: number;
    gameName: string;
    gameid: Long;
    gameDataBlob: Buffer;
    broadcastId: Long;
    gameLobbyId: Long;
    playerNamePendingReview: boolean;
    avatarPendingReview: boolean;
}

type ClientPersonaState = {
    statusFlags: number;
    friends: Friend[];
}

type ClientPlayingSessionState = {
    playingBlocked: boolean;
    playingApp: number;
}

type ClientRequestFreeLicenseRes = {
    eresult: number;
    grantedAppids: number[];
}

type ClientPICSProductInfoResponse = {
    packages?: Package[];
    apps?: App[];
    metaDataOnly: boolean;
    responsePending?: boolean;
}

type PackageInfo = {
    packageid: number;
    billingtype: number;
    licensetype: number;
    status: number;
    extended: {
        basepackage: number;
        disabletradingcards: number;
        dontgrantifappidowned: number;
        expirytime: number;
        freepromotion: number;
        starttime: number;
        allowcrossregiontradingandgifting: boolean;
        allowpurchaseinsteamchina: number;
        purchaserestrictedcountries: string;
    };
    appids: number[];
    depotids: number[];
    appitems: [];
}

type PackageBuffer = {
    [packageid: string]: PackageInfo;
}

type AppBuffer = {
    appinfo: {
        appid: number;
        common: {
            name: string;
            type: string;
            logo: string;
            logo_small: string;
            icon: string;
            clienticon: string;
            clienttga: string;
            gameid: string;
        };
        extended: Record<string, T>;
        config: Record<string, T>;
        depots: Record<string, T>;
        ufs: Record<string, T>;
    };
}

type ClientPurchaseRes = {
    eresult: number;
    purchaseResultDetails: number;
    purchaseReceiptInfo: Buffer;
}

type PurchaseReceiptInfo = {
    MessageObject: {
        resultdetail: number;
        packageid: number;
        lineitems: { PackageID?: number; packageID?: number; packageid?: number }[];
    };
}