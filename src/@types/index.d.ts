/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' loginkey when it is accepted.
 *
 */
import Connection from "./connection";
export default class Steam extends Connection {
  private loggedIn;
  constructor();
  /**
   * Login to Steam
   */
  login(options: LoginOptions): Promise<{
    auth: AccountAuth;
    data: AccountData;
  }>;
  /**
   * Change persona name or status
   */
  clientChangeStatus(body: ChangeStatusOption): void;
  /**
   * Idle an array of appIds
   * empty array stops idling
   */
  clientGamesPlayed(appIds: number[]): void;
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

export interface LooseObject {
  [key: string]: any;
}

export interface GamesPlayedOption extends LooseObject {
  gamesPlayed: { gameId: number }[];
}

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

export type Sentry = Buffer;

export interface ChangeStatusOption {
  personaState?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  playerName?: string;
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
