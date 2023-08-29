import { Language } from "./modules/language.js";
import Steam from "./Steam.js";
import { SteamClientError } from "./modules/common.js";
import { EResult } from "./language/EResult.js";
import { EMsg } from "./language/enums_clientserver.js";
import { EOSType, EPersonaState } from "./language/enums.steamd.js";
import Long from "long";
import type { AccountAuth, AccountData, Friend, LoginOptions } from "../@types/client.js";
import type { ConnectionOptions } from "../@types/connections/Base.js";

export { EMsg, EResult, SteamClientError };

export default class Client extends Steam {
  private personaState!: Friend;
  private _playingSessionState = {} as CMsgClientPlayingSessionState;

  constructor(options: ConnectionOptions) {
    super(options);

    // catch changes to personaState, playerName or avatar
    this.conn.on("ClientPersonaState", (body: CMsgClientPersonaState) => {
      const me = body.friends![0];

      // have never received status
      if (!this.personaState) {
        // state does not belong to this account
        if (this.personaName !== me.playerName) return;
        this.personaState = me;
        this.personaState.avatarString = this.getAvatar(this.personaState.avatarHash);
        this.emit("ClientPersonaState", this.personaState);
        return;
      }

      // state does not belong to this account
      if (me.friendid!.notEquals(this.personaState.friendid!)) return;

      // check if playerName, personaState or avatar changed
      let somethingChanged = false;
      if (
        me.avatarHash!.toString("hex") !== this.personaState.avatarHash!.toString("hex") ||
        me.personaState !== this.personaState.personaState ||
        me.playerName !== this.personaState.playerName ||
        me.gamePlayedAppId !== this.personaState.gamePlayedAppId
      ) {
        somethingChanged = true;
      }

      if (somethingChanged) {
        this.personaState = me;
        this.personaName = this.personaState.playerName!;
        this.personaState.avatarString = this.getAvatar(this.personaState.avatarHash);
        this.emit("ClientPersonaState", this.personaState);
      }
    });

    // emitted after ClientGamesPlayed
    this.conn.on("ClientPlayingSessionState", (body: CMsgClientPlayingSessionState) => {
      this._playingSessionState = body;
      this.emit("ClientPlayingSessionState", body);
    });
    this.conn.on("ClientConcurrentSessionsBase", (body: CMsgClientPlayingSessionState) => {
      this._playingSessionState = body;
      this.emit("ClientPlayingSessionState", body);
    });
    this.conn.on("disconnected", (err) => this.emit("disconnected", err));
  }

  /**
   * login to steam via credentials or refresh_token
   */
  public async login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }> {
    // verify refresh token
    if (options.refreshToken) {
      this.verifyRefreshToken(options.refreshToken);
    }

    options = {
      ...options,
      protocolVersion: 65580,
      cellId: 4294967295,
      clientPackageVersion: 1690583737,
      clientLanguage: "english",
      clientOsType: EOSType.Win11,
      shouldRememberPassword: true,
      obfuscatedPrivateIp: {
        ip: {
          v4: await this.obfustucateIp(),
        },
      },
      qosLevel: 2,
      machineId: options.machineId || this.machineId,
      machineName: options.machineName || this.machineName,
      supportsRateLimitResponse: true,
      priorityReason: 11,
      accessToken: options.refreshToken,
    } as CMsgClientLogon;

    delete options.refreshToken;

    const accountData = { inventory: {} } as AccountData;

    const accountAuth: AccountAuth = {
      machineName: options.machineName!,
    };

    let responses = ["ClientAccountInfo", "ClientEmailAddrInfo", "ClientIsLimitedAccount", "ClientVACBanStatus"];

    const receivedResponse = (response: string) => {
      // remove this response from array
      responses = responses.filter((item) => item !== response);
    };

    this.conn.once("ClientAccountInfo", async (body: CMsgClientAccountInfo) => {
      this.personaName = body.personaName!;
      accountData.personaState = await this.setPersonaState("Online");
      receivedResponse("ClientAccountInfo");
    });

    this.conn.once("ClientEmailAddrInfo", (body: CMsgClientEmailAddrInfo) => {
      accountData.isEmailVerified = body.emailIsValidated!;
      accountData.emailOrDomain = body.emailAddress!;
      accountData.credentialChangeRequiresCode = body.credentialChangeRequiresCode!;
      receivedResponse("ClientEmailAddrInfo");
    });

    this.conn.once("ClientIsLimitedAccount", (body: CMsgClientIsLimitedAccount) => {
      accountData.limited = body.bisLimitedAccount!;
      accountData.communityBanned = body.bisCommunityBanned!;
      accountData.locked = body.bisLockedAccount!;
      receivedResponse("ClientIsLimitedAccount");
    });

    this.conn.once("ClientVACBanStatus", (body) => {
      accountData.vac = body.vac;
      receivedResponse("ClientVACBanStatus");
    });

    // send login request to steam
    const res: CMsgClientLogOnResponse = await this.conn.sendProtoPromise(EMsg.ClientLogon, options, EMsg.ClientLogOnResponse);
    if (res.eresult === EResult.OK) {
      accountData.steamId = res.clientSuppliedSteamid!.toString();
      accountData.games = await this.service.player.getOwnedGames();
      accountData.inventory.steam = []; //await this.service.econ.getSteamContextItems();
    } else {
      this.disconnect();
      throw new SteamClientError(Language.EResultMap.get(res.eresult!)!);
    }

    return new Promise((resolve, reject) => {
      // expect responses to occur before timeout
      const timeout = setTimeout(() => {
        clearInterval(interval);
        this.disconnect();
        reject(new SteamClientError("Did not receive responses: " + responses.toString()));
      }, 15000);

      // check whether user is logged in every second
      const interval = setInterval(() => {
        if (responses.length) return;
        clearTimeout(timeout);
        clearInterval(interval);
        resolve({ auth: accountAuth, data: { ...accountData, playingState: this._playingSessionState } });
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
      this.conn.sendProto(EMsg.ClientKickPlayingSession, { onlyStopGame: true });
    }

    // not playing and trying to stop idle
    if (!playingGame && !gameIds.length) {
      return;
    }

    const body = {
      gamesPlayed: gameIds.map((id) => {
        return { gameId: Long.fromInt(id, true) };
      }),
      clientOsType: EOSType.Win11,
    } as CMsgClientGamesPlayed;

    await this.conn.sendProtoPromise(EMsg.ClientGamesPlayedWithDataBlob, body, EMsg.ClientConcurrentSessionsBase);
  }

  /**
   * Activate free games
   */
  public async requestFreeLicense(appids: number[]): Promise<CPlayer_GetOwnedGames_Response["games"]> {
    if (!appids.length) return [];

    const res: CMsgClientRequestFreeLicenseResponse = await this.conn.sendProtoPromise(
      EMsg.ClientRequestFreeLicense,
      {
        appids,
      } as CMsgClientRequestFreeLicense,
      EMsg.ClientRequestFreeLicenseResponse
    );

    if (res.eresult !== EResult.OK) {
      throw new SteamClientError(Language.EResultMap.get(res.eresult!)!);
    }

    if (!res.grantedAppids || !res.grantedAppids.length) return [];

    return this.service.player.getOwnedGames({ appidsFilter: res.grantedAppids, includePlayedFreeGames: true });
  }

  /**
   * Whether playing is blocked by another session
   */
  public get isPlayingBlocked() {
    return !!this._playingSessionState.playingBlocked;
  }

  /**
   * Whether account is playing a game
   */
  public get isPlayingGame() {
    return !!this._playingSessionState.playingApp;
  }

  public get playingSessionState() {
    return JSON.parse(JSON.stringify(this._playingSessionState)) as CMsgClientPlayingSessionState;
  }

  private getAvatar(hash: Friend["avatarHash"]): string {
    //default avatar
    const defaultHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";

    let hashHex = hash!.toString("hex");

    //default avatar
    if (hashHex === "0000000000000000000000000000000000000000") {
      hashHex = defaultHash;
    }

    return `https://avatars.akamai.steamstatic.com/${hashHex}_full.jpg`;
  }

  /**
   * Change player name or persona state
   */
  private async changeStatus(payload: CMsgClientChangeStatus): Promise<Friend> {
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

    this.conn.sendProto(EMsg.ClientChangeStatus, payload);

    return new Promise((resolve) => {
      this.once("ClientPersonaState", (state: Friend) => {
        return resolve(state);
      });
    });
  }

  private verifyRefreshToken(refreshToken: string) {
    try {
      const headerBase64 = refreshToken.split(".")[1];
      const header = JSON.parse(atob(headerBase64));

      if (header.iss !== "steam" || !header.aud.includes("renew")) {
        throw new SteamClientError("This is not a steam refresh token.");
      }

      if (!header.aud.includes("client")) {
        throw new SteamClientError("This is not a client refresh token.");
      }

      if (header.exp - Math.floor(Date.now() / 1000) < 30) {
        throw new SteamClientError("RefreshTokenExpired");
      }

      // all good supply steamid to base connection
      this.conn.setSteamId(header.sub);
    } catch (error) {
      if (error instanceof SteamClientError) {
        throw error;
      }
      throw new SteamClientError("Refresh token is bad.");
    }
  }
}
