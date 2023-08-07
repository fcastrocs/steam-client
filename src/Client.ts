import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
import { Language } from "./resources.js";
import Steam from "./Steam.js";
import { LoginOptions, LoginOptionsExtended } from "../@types/steam.js";
import {
  ClientPersonaState,
  ClientPurchaseRes,
  ClientRequestFreeLicenseRes,
  ClientPlayingSessionState,
  Friend,
  PurchaseReceiptInfo,
  ClientPICSProductInfoResponse,
  PackageBuffer,
  ClientAccountInfo,
  ClientEmailAddrInfo,
  ClientIsLimitedAccount,
  ClientLogonResponse,
} from "../@types/protoResponse.js";
import { SteamClientError, getKeyByValue } from "./common.js";
import { EOSType, EPersonaState, EPurchaseResultDetail } from "./language/commons.js";
import { EMsg } from "./language/enums_clientserver.proto.js";
import { EResult } from "./language/EResult.js"
import { AccountAuth, AccountData, Game } from "../@types/client.js";
import { ConnectionOptions } from "../@types/connection.js";

export default class Client extends Steam {
  private personaState: Friend;
  private _playingSessionState = {} as ClientPlayingSessionState;

  constructor(options: ConnectionOptions) {
    super(options);

    // catch changes to personaState, playerName or avatar
    this.on("ClientPersonaState", (body: ClientPersonaState) => {
      // have never received status
      if (!this.personaState) {
        // state does not belong to this account
        if (this.personaName !== body.friends[0].playerName) return;
        this.personaState = body.friends[0];
        this.personaState.avatarString = this.getAvatar(this.personaState.avatarHash);
        this.emit("personaStateChanged", this.personaState);
        return;
      }

      const state = body.friends[0];

      // state does not belong to this account
      if (state.friendid.notEquals(this.personaState.friendid)) return;

      // check if playerName, personaState or avatar changed
      let somethingChanged = false;
      if (
        state.avatarHash.toString("hex") !== this.personaState.avatarHash.toString("hex") ||
        state.personaState !== this.personaState.personaState ||
        state.playerName !== this.personaState.playerName ||
        state.gamePlayedAppId !== this.personaState.gamePlayedAppId
      ) {
        somethingChanged = true;
      }

      if (somethingChanged) {
        this.personaState = state;
        this.personaName = this.personaState.playerName;
        this.personaState.avatarString = this.getAvatar(this.personaState.avatarHash);
        this.emit("personaStateChanged", this.personaState);
      }
    });

    this.on("ClientPlayingSessionState", (body: ClientPlayingSessionState) => {
      this._playingSessionState = body;
      this.emit("playingStateChanged", body);
    });
  }

  /**
 * login to steam via credentials or refresh_token
 */
  public async login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }> {
    const refreshToken = options.refreshToken;
    delete options.refreshToken;

    options = {
      ...options,
      accessToken: refreshToken,
      clientOsType: EOSType.Win11,
      protocolVersion: 65580,
      supportsRateLimitResponse: true,
      machineName: options.machineName || this.machineName,
    } as LoginOptionsExtended;

    const accountData = {
      games: [],
      inventory: {},
    } as AccountData;

    const accountAuth: AccountAuth = {
      machineName: options.machineName,
    };

    let responses = ["ClientAccountInfo", "ClientEmailAddrInfo", "ClientIsLimitedAccount", "ClientVACBanStatus"];

    const receivedResponse = (response: string) => {
      // remove this response from array
      responses = responses.filter((item) => item !== response);
    };

    this.once("ClientAccountInfo", async (body: ClientAccountInfo) => {
      this.personaName = body.personaName;
      accountData.personaState = await this.setPersonaState("Online");
      receivedResponse("ClientAccountInfo");
    });

    this.once("ClientEmailAddrInfo", (body: ClientEmailAddrInfo) => {
      accountData.isEmailVerified = body.emailIsValidated;
      accountData.emailOrDomain = body.emailAddress;
      accountData.credentialChangeRequiresCode = body.credentialChangeRequiresCode;
      receivedResponse("ClientEmailAddrInfo");
    });

    this.once("ClientIsLimitedAccount", (body: ClientIsLimitedAccount) => {
      accountData.limited = body.bisLimitedAccount;
      accountData.communityBanned = body.bisCommunityBanned;
      accountData.locked = body.bisLockedAccount;
      receivedResponse("ClientIsLimitedAccount");
    });

    this.once("ClientVACBanStatus", (body) => {
      accountData.vac = body.vac;
      receivedResponse("ClientVACBanStatus");
    });

    // send login request to steam
    const res: ClientLogonResponse = await this.sendProtoPromise(EMsg.ClientLogon, options);

    if (res.eresult === EResult.OK) {
      this.startHeartBeat(res.heartbeatSeconds);
      accountData.steamId = res.clientSuppliedSteamid.toString();
      accountData.games = await this.service.player.getOwnedGames();
      accountData.inventory.steam = await this.service.econ.getSteamContextItems();
      this.loggedIn = true;
    } else {
      this.disconnect();
      throw new SteamClientError(Language.EResultMap.get(res.eresult));
    }

    return new Promise((resolve, reject) => {
      // expect responses to occur before timeout
      const timeout = setTimeout(() => {
        clearInterval(interval);
        this.disconnect();
        reject(new SteamClientError("Did not receive responses: " + responses.toString()));
      }, this.timeout);

      // check whether user is logged in every second
      const interval = setInterval(() => {
        if (responses.length) return;
        clearTimeout(timeout);
        clearInterval(interval);
        resolve({ auth: accountAuth, data: { ...accountData, playingState: this.playingSessionState } });
      }, 1000);
    });
  }

  /**
   * Change player nickname
   */
  public setPlayerName(playerName: string): Promise<Friend> {
    return this.changeStatus({ playerName });
  }

  /**
   * Change player persona state
   */
  public setPersonaState(personaState: keyof typeof EPersonaState): Promise<Friend> {
    return this.changeStatus({ personaState: EPersonaState[personaState] });
  }

  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  public async gamesPlayed(gameIds: number[], options?: { forcePlay?: boolean }) {
    const playingBlocked = this.isPlayingBlocked;
    const playingGame = this.isPlayingGame;

    if (playingBlocked && !options?.forcePlay) {
      throw new SteamClientError("AlreadyPlayingElseWhere");
    }

    // kick another playing session before attemping to play in this session
    if (playingBlocked) {
      this.sendProto(EMsg.ClientKickPlayingSession, { onlyStopGame: true });
    }

    // not playing and trying to stop idle
    if (!playingGame && !gameIds.length) {
      return;
    }

    const payload = {
      gamesPlayed: gameIds.map((id) => {
        return { gameId: id };
      }),
    };

    await this.sendProtoPromise(
      EMsg.ClientGamesPlayed,
      payload,
      EMsg.ClientPlayingSessionState
    );
  }

  /**
   * Activate cdkey
   */
  public async registerKey(cdkey: string): Promise<Game[]> {
    const res: ClientPurchaseRes = await this.sendProtoPromise(
      EMsg.ClientRegisterKey,
      { key: cdkey },
      EMsg.ClientPurchaseResponse
    );

    // something went wrong
    if (res.eresult !== EResult.OK) {
      throw new SteamClientError(getKeyByValue(EPurchaseResultDetail, res.purchaseResultDetails));
    }

    const receipt = (BinaryKVParser.parse(res.purchaseReceiptInfo) as PurchaseReceiptInfo).MessageObject;
    // get packgeIds
    const packageIds = [];
    for (const item of receipt.lineitems) {
      const packageId = item.PackageID || item.packageID || item.packageid;
      if (!packageId) continue;
      packageIds.push(packageId);
    }

    const appIds = await this.getAppIds(packageIds);
    return this.service.player.getOwnedGames({ appidsFilter: appIds });
  }

  /**
   * Activate free games
   */
  public async requestFreeLicense(appids: number[]): Promise<Game[]> {
    if (!appids.length) return [];

    const res: ClientRequestFreeLicenseRes = await this.sendProtoPromise(EMsg.ClientRequestFreeLicense, {
      appids,
    });

    if (res.eresult !== EResult.OK) {
      throw new SteamClientError(Language.EResultMap.get(res.eresult));
    }

    if (!res.grantedAppids || !res.grantedAppids.length) return [];

    return this.service.player.getOwnedGames({ appidsFilter: res.grantedAppids, includePlayedFreeGames: true });
  }

  /**
   * Whether playing is blocked by another session
   */
  public get isPlayingBlocked() {
    return this._playingSessionState.playingBlocked;
  }

  /**
   * Whether account is playing a game
   */
  public get isPlayingGame() {
    return !!this._playingSessionState.playingApp;
  }

  public get playingSessionState() {
    return JSON.parse(JSON.stringify(this._playingSessionState)) as ClientPlayingSessionState;
  }

  private getAvatar(hash: Friend["avatarHash"]): string {
    //default avatar
    const defaultHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";

    let hashHex = hash.toString("hex");

    //default avatar
    if (hashHex === "0000000000000000000000000000000000000000") {
      hashHex = defaultHash;
    }

    return `https://avatars.akamai.steamstatic.com/${hashHex}_full.jpg`;
  }

  /**
   * Change player name or persona state
   */
  private async changeStatus(payload: ClientChangeStatus): Promise<Friend> {
    let somethingChanged = false;

    if (this.personaState) {
      if (payload.personaState) {
        // whether a change is being made
        if (payload.personaState !== this.personaState.personaState) somethingChanged = true;
      } else {
        // whether a change is being made
        if (payload.playerName !== this.personaState?.playerName) somethingChanged = true;
      }

      // nothing changed return old state
      if (!somethingChanged) return this.personaState;
    }

    this.sendProto(EMsg.ClientChangeStatus, payload);

    return new Promise((resolve) => {
      this.once("personaStateChanged", (state: Friend) => {
        return resolve(state);
      });
    });
  }

  /**
   * Get all appIds from packages
   */
  private getAppIds(packageIds: number[]): Promise<number[]> {
    // don't include default steam package id === 0
    packageIds = packageIds.filter((id) => id !== 0);

    if (!packageIds.length) return Promise.resolve([]);

    const packages = packageIds.map((id) => {
      return { packageid: id };
    });

    // send packge info request to steam
    this.sendProto(EMsg.ClientPICSProductInfoRequest, { packages });

    // wait for all(Multi response) packages info
    return new Promise((resolve) => {
      const appIds: number[] = [];

      this.on("ClientPICSProductInfoResponse", (res: ClientPICSProductInfoResponse) => {
        if (res.packages) {
          for (const pkg of res.packages) {
            // package not fully received
            if (pkg.missingToken) {
              continue;
            }
            const packageBuffer: PackageBuffer = BinaryKVParser.parse(pkg.buffer);

            for (const appid of packageBuffer[pkg.packageid].appids) {
              appIds.push(appid);
            }
          }
        }

        // received all packages info
        if (!res.responsePending) {
          this.removeAllListeners("ClientPICSProductInfoResponse");
          resolve([...new Set(appIds)]);
        }
      });
    });
  }
}
