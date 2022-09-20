import Long from "long";

// proto
interface ClientLogonResponse {
  eresult: number;
  legacyOutOfGameHeartbeatSeconds: number;
  heartbeatSeconds: number;
  deprecatedPublicIp: number;
  rtime32ServerTime: number;
  accountFlags: number;
  cellId: number;
  webapiAuthenticateUserNonce: string;
  cellIdPingThreshold: number;
  vanityUrl: string;
  publicIp: { v4: number };
  clientSuppliedSteamid: Long;
  ipCountryCode: "US";
  parentalSettings: Buffer;
  parentalSettingSignature: Buffer;
  countLoginfailuresToMigrate: number;
  countDisconnectsToMigrate: number;
  clientInstanceId: Long;
  tokenId: Long;
}

// proto
interface ClientAccountInfo {
  personaName: string;
  ipCountry: string;
  countAuthedComputers: number;
  accountFlags: number;
  twoFactorState: number;
}

// proto
interface ClientEmailAddrInfo {
  emailAddress: string;
  emailIsValidated: boolean;
  emailValidationChanged: boolean;
  credentialChangeRequiresCode: boolean;
  passwordOrSecretqaChangeRequiresCode: boolean;
  remindUserAboutEmail: boolean;
}

interface License {
  packageId: number;
  timeCreated: number;
  timeNextProcess: number;
  minuteLimit: number;
  minutesUsed: number;
  paymentMethod: number;
  flags: number;
  purchaseCountryCode: string;
  licenseType: number;
  territoryCode: number;
  changeNumber: number;
  ownerId: number;
  initialPeriod: number;
  initialTimeUnit: number;
  renewalPeriod: number;
  renewalTimeUnit: number;
  accessToken: Long;
}

// proto
interface ClientLicenseList {
  eresult: number;
  licenses: License[];
}

// proto
interface ClientIsLimitedAccount {
  bisLimitedAccount: boolean;
  bisCommunityBanned: boolean;
  bisLockedAccount: boolean;
  bisLimitedAccountAllowedToInviteFriends: boolean;
}

interface Friend {
  friendid: Long;
  personaState: number;
  gamePlayedAppId: number;
  personaStateFlags: number;
  onlineSessionInstances: number;
  playerName: string;
  steamidSource: Long;
  avatarHash: Buffer;
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

// proto
interface ClientPersonaState {
  statusFlags: number;
  friends: Friend[];
}

interface Package {
  packageid: number;
  changeNumber: number;
  missingToken: boolean;
  sha: Buffer;
  buffer: Buffer;
  size: number;
}

interface App {
  appid: number;
  changeNumber: number;
  missingToken: boolean;
  sha: Buffer;
  buffer: Buffer;
  onlyPublic: boolean;
  size: number;
}

// proto
interface ClientPICSProductInfoResponse {
  packages?: Package[];
  apps?: App[];
  metaDataOnly: boolean;
  responsePending?: boolean;
}

interface PackageInfo {
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

interface PackageBuffer {
  [packageid: string]: PackageInfo;
}

interface AppBuffer {
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

// proto
interface ClientUpdateMachineAuth {
  filename: string;
  offset: number;
  cubtowrite: number;
  bytes: Buffer;
}

// proto
interface ClientPlayingSessionState {
  playingBlocked: boolean;
  playingApp: number;
}

interface ClientRequestFreeLicenseRes {
  eresult: number;
  grantedAppids: number[];
}

interface ClientPurchaseResponse {
  eresult: number;
  purchaseResultDetails: number;
  purchaseReceiptInfo: Buffer;
}

interface PurchaseReceiptInfo {
  MessageObject: {
    resultdetail: number; // same as purchaseResultDetails
    packageid: number;
    lineitems: { PackageID?: number; packageID?: number; packageid?: number }[];
  };
}
