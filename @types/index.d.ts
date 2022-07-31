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

export default class Steam extends Connection {
  on(event: "disconnected", listener: (error: Error) => void): this;
  on(event: "loginKey", listener: (loginKey: string) => void): this;
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
   * Change persona name or status
   */
  clientChangeStatus(body: ChangeStatusOption): void;
  /**
   * Idle an array of appIds
   * empty array stops idling
   */
  idleGames(games: IdleGame[]): void;
  /**
   * Activate cdkey
   */
  cdkeyRedeem(cdkey: string): Promise<Game[]>;
  /**
   * Activate free games
   */
  clientRequestFreeLicense(appIds: number[]): Promise<Game[]>;
  /**
   * Get avatar from CMsgClientPersonaState response
   */
  private getAvatar;
  /**
   * Get packagesInfo from a list of packageIds
   */
  private getPackagesInfo;
  /**
   * Get appsInfo from a list of appIds
   */
  private getAppsInfo;
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
export type PersonaState = 0 | 1 | 2 | 3 | 4;

export interface LooseObject {
  [key: string]: any;
}

export type IdleGame = { gameId: number }[];

export interface RequestFreeLicenseOption extends LooseObject {
  appids: number[];
}

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

export interface ChangeStatusOption {
  personaState?: PersonaState;
  playerName?: string;
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
  emailOrDomain: string;
  emailVerified: boolean;
  secure: boolean;
}
