/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' emits loginkey when it is accepted.
 *
 */
import Connection from "./connection";
import { AccountAuth, AccountData, ChangeStatusOption, Game, LoginOptions } from "./types";
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
