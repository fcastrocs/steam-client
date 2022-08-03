/**
 * Manages high-level Steam operations
 */
import Connection from "./connection";
import { SocksClientOptions } from "socks";

export interface Options {
  steamCM: SocksClientOptions["destination"];
  proxy?: SocksClientOptions["proxy"];
  timeout?: number;
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

export class SteamClientError extends Error {
  constructor(message: string);
}

export default class Steam extends Connection {
  on(event: "disconnected", listener: (error: Error) => void): this;
  on(event: "loginKey", listener: (loginKey: string) => void): this;
  private personaState: number;
  constructor(options: Options);
  /**
   * Login to Steam
   */
  login(options: LoginOptions): Promise<SteamAccount>;
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
   * Parse appsInfo into a nice games array
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

export type Sentry = Buffer;
export type State = "offline" | "online" | "busy" | "away" | "snooze";

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
  games: AppInfo[];
  emailOrDomain: string;
  emailVerified: boolean;
  secure: boolean;
}

export interface SteamAccount {
  auth: AccountAuth;
  data: AccountData;
}

export interface PackageInfo {
  packageid: number;
  billingtype: number;
  licensetype: number;
  status: number;
  extended: [];
  appids: number[];
  depotids: number[];
  appitems: [];
}

export interface AppInfo {
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
