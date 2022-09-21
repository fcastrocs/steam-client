/**
 * Manages high-level Steam operations
 */
import Auth, { Confirmation } from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Client from "./client.js";
import IConnection from "./connection.js";
import { Friend } from "./protoResponse.js";
import SteamClientError from "SteamClientError.js";

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

export { SteamClientError };

export default class ISteam extends IConnection {
  on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;
  on(event: "ClientLoggedOff", listener: (eresult: string) => void): this;
  on(event: "PersonaStateChanged", listener: (state: Friend) => void): this;

  readonly service: {
    auth: Auth;
    credentials: Credentials;
  };
  readonly client: Client;
  readonly machineName: string;

  /**
   * login to steam via credentials or refresh_token
   */
  public login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }>;

  /**
   * Disconnect user from Steam and kill connection
   */
  public disconnect(): void;

  /**
   * Whether user is logged in
   */
  get isLoggedIn(): boolean;

  /**
   * Whether playing is blocked by another session
   */
  get isPlayingBlocked(): boolean;

  /**
   * Get all appIds from packages
   */
  public getAppIds(packageIds: number[]): Promise<number[]>;

  /**
   * Get appsInfo from a list of appIds
   */
  public getAppsInfo(appIds: number[]): Promise<AppBuffer["appinfo"][]>;

  /**
   * Get only games from appsInfo[]
   */
  public getGames(appsInfo: AppBuffer["appinfo"][]): Game[];
}
