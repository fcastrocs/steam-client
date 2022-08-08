/**
 * Manages high-level Steam operations
 */
import Connection from "./connection";
import { SocksClientOptions } from "socks";

export = Steam;

export namespace Steam {
  interface Options {
    steamCM: SocksClientOptions["destination"];
    proxy?: SocksClientOptions["proxy"];
    timeout?: number;
  }

  interface LoginOptions {
    accountName: string;
    password?: string;
    machineName?: string;
    clientOsType?: number;
    shouldRememberPassword?: boolean;
    twoFactorCode?: string;
    loginKey?: string;
    shaSentryfile?: Buffer;
    authCode?: string;
    protocolVersion?: 65580;
    supportsRateLimitResponse?: true;
    machineId?: Buffer;
  }

  type Sentry = Buffer;
  type State = "offline" | "online" | "busy" | "away" | "snooze";

  interface AccountAuth {
    sentry: Buffer;
    loginKey: string;
    machineName: string;
    webNonce: string;
  }

  interface AccountData {
    steamId: string;
    limited: boolean;
    vac: boolean;
    avatar: string;
    nickname: string;
    communityBanned: boolean;
    locked: boolean;
    games: AppInfo[];
    emailOrDomain: string;
    emailVerified: boolean;
    secure: boolean;
  }

  interface PackageInfo {
    packageid: number;
    billingtype: number;
    licensetype: number;
    status: number;
    extended: [];
    appids: number[];
    depotids: number[];
    appitems: [];
  }

  interface AppInfo {
    logo: string;
    logo_small: string;
    name: string;
    type: string;
    gameid: number;
  }

  /**
   * Internal interfaces
   */
  interface LooseObject {
    [key: string]: any;
  }

  interface PersonaStateResponse {
    personaState: number;
    playerName: string;
    avatarHash: Buffer;
  }

  interface ProductInfoResponse {
    packages?: Package[];
    apps?: App[];
    metaDataOnly: boolean;
    responsePending: boolean;
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
    onlyPublic;
    size: number;
  }

  interface PackageBuffer {
    [packageid: string]: PackageInfo;
  }

  interface AppBuffer {
    appinfo: {
      appid: number;
      common: AppInfo;
    };
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

  class Steam extends Connection {
    private personaState;
    constructor(options: Options);
    /**
     * Login to Steam
     */
    login(options: LoginOptions): Promise<{
      auth: AccountAuth;
      data: AccountData;
    }>;
    /**
     * Get a web api nonce to login to steamcommunity
     */
    getWebNonce(): Promise<string>;
    /**
     * Change change player Name
     */
    changePlayerName(name: string): void;
    /**
     * Change persona state
     */
    changePersonaState(state: State): void;
    /**
     * Idle an array of appIds
     * empty array stops idling
     */
    idleGames(gameIds: number[]): void;
    /**
     * Activate cdkey
     */
    cdkeyRedeem(cdkey: string): Promise<AppInfo[]>;
    /**
     * Activate free games
     */
    activateFreeToPlayGames(appids: number[]): Promise<AppInfo[]>;
    /**
     * Get avatar from CMsgClientPersonaState response
     */
    private getAvatar;
    /**
     * Get packagesInfo from a list of packageIds
     */
    getPackagesInfo(packageIds: number[]): Promise<PackageInfo[]>;
    /**
     * Get appsInfo from a list of appIds
     */
    getAppsInfo(appIds: number[]): Promise<AppInfo[]>;
    /**
     * get games from AppInfo[]
     */
    private getGames;
    /**
     * Create a machineID based of accountName
     */
    private createMachineID;
    /**
     * Accept sentry
     */
    private clientUpdateMachineAuthResponse;
    /**
     * Create a random machine name
     */
    private createMachineName;
  }

  class SteamClientError extends Error {
    constructor(message: string);
  }
}
