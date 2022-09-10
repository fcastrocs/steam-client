/**
 * Manages high-level Steam operations
 */
import Connection, { ConnectionOptions } from "./connection.js";
import Long from "long";
import { Confirmation } from "./auth.js";

export = Steam;

declare namespace Steam {
  interface LoginOptions {
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

  interface AccountAuth {
    sentry: Buffer;
    machineName: string;
    machineId: Buffer;
    webNonce: string;
    tokenId: Long;
  }

  interface AccountData {
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

  interface Game {
    name: string;
    logo: string;
    logo_small: string;
    icon: string;
    clienticon: string;
    clienttga: string;
    gameid: number;
  }

  class Steam extends Connection {
    on(event: "waitingForConfirmation", listener: (confirmation: Confirmation) => void): this;

    readonly service: {
      auth: Auth;
      credentials: Credentials;
    };
    readonly action: Actions;
    readonly machineName: string;
    private loggedIn: boolean;
    private playingBlocked: boolean;

    constructor(options: ConnectionOptions);

    login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }>;

    get isLoggedIn(): boolean;
    get isPlayingBlocked(): boolean;
    private getAvatar;
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
    private clientUpdateMachineAuthResponse;
    private createMachineName;
    /**
     * Create a machineID based of accountName
     */
    private createMachineId;
  }
}
