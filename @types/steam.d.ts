/**
 * Manages high-level Steam operations
 */
import Long from "long";
import Auth, { Confirmation } from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Actions from "./Actions.js";
import IConnection from "./connection.js";

export interface LoginOptions {
  accountName?: string;
  password?: string;
  machineName?: string;
  clientOsType?: number;
  shouldRememberPassword?: boolean;
  twoFactorCode?: string;
  shaSentryfile?: Buffer;
  authCode?: string;
  protocolVersion?: 65580;
  supportsRateLimitResponse?: true;
  machineId?: Buffer;
  anonUserTargetAccountName?: "anonymous";
  accessToken?: string;
}

export interface AccountAuth {
  sentry: Buffer;
  machineName: string;
  machineId: Buffer;
  webNonce: string;
  tokenId: Long;
}

export interface AccountData {
  steamId: string;
  limited: boolean;
  vac: boolean;
  avatar: string;
  personaName: string;
  communityBanned: boolean;
  locked: boolean;
  games: Game[];
  emailOrDomain: string;
  isEmailVerified: boolean;
  credentialChangeRequiresCode: boolean;
  isSteamGuardEnabled: boolean;
}

export interface Game {
  name: string;
  logo: string;
  logo_small: string;
  icon: string;
  clienticon: string;
  clienttga: string;
  gameid: number;
}

export default interface ISteam extends IConnection {
  on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
  readonly service: {
    auth: Auth;
    credentials: Credentials;
  };
  readonly action: Actions;
  readonly machineName: string;

  login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }>;

  get isLoggedIn(): boolean;
  get isPlayingBlocked(): boolean;
  /**
   * Get all appIds from packages
   */
  getAppIds(packageIds: number[]): Promise<{ appid: number }[]>;
  /**
   * Get appsInfo from a list of appIds
   */
  getAppsInfo(apps: { appid: number }[]): Promise<AppBuffer["appinfo"][]>;
  /**
   * Get only games from appsInfo[]
   */
  getGames(appsInfo: AppBuffer["appinfo"][]): Game[];
}
