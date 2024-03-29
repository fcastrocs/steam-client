import Steam from "./Steam.js";
import Language from "./modules/language.js";
import { SteamClientError, isEmpty } from "./modules/common.js";
import { EOSType } from "../resources/language/enums.steamd.js";
import Long from "long";
import type { Friend, LoginOptions, LoginRes } from "../@types/Client.js";
import type { ConnectionOptions } from "../@types/connections/Base.js";
import type { CMsgClientIsLimitedAccount, CMsgClientGamesPlayed } from "../@types/protos/steammessages_clientserver.js";
import type {
  CMsgClientPlayingSessionState,
  CMsgClientEmailAddrInfo,
  CMsgClientRequestFreeLicenseResponse,
  CMsgClientRequestFreeLicense,
} from "../@types/protos/steammessages_clientserver_2.js";
import type { CMsgClientPersonaState } from "../@types/protos/steammessages_clientserver_friends.js";
import type {
  CMsgClientLogon,
  CMsgClientAccountInfo,
  CMsgClientLogOnResponse,
} from "../@types/protos/steammessages_clientserver_login.js";
import type { CPlayer_GetOwnedGames_Response } from "../@types/protos/steammessages_player.steamclient.js";
import { ValueOf } from "type-fest";

const { EMsg, EResult, EResultMap, EPersonaState } = Language;
// responses that should be received before login is complete
const LOGIN_RESPONSES = [
  "ClientAccountInfo",
  "ClientEmailAddrInfo",
  "ClientIsLimitedAccount",
  "ClientVACBanStatus",
  "SteamContextItems",
];

export default class Client extends Steam {
  private personaState: Friend = {};
  private _playingSessionState: CMsgClientPlayingSessionState = {};

  constructor(options: ConnectionOptions) {
    super(options);

    // catch changes to personaState, playerName or avatar
    this.conn.on("ClientPersonaState", (body: CMsgClientPersonaState) => {
      const me = body.friends[0];

      if (me.friendid.equals(this.steamId)) {
        this.personaState = me;
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
  public async login(options: LoginOptions): Promise<LoginRes> {
    // verify refresh token
    if (options.refreshToken) {
      this.verifyRefreshToken(options.refreshToken);
    }

    // configure options
    options = {
      ...options,
      protocolVersion: 65580,
      cellId: 4294967295,
      clientPackageVersion: 1698777785,
      clientLanguage: "english",
      clientOsType: EOSType.Win11,
      shouldRememberPassword: true,
      // comment this out for now, it's not necessary
      /*obfuscatedPrivateIp: {
                ip: {
                    v4: await this.obfustucateIp(),
                },
            },*/
      qosLevel: 2,
      machineId: options.machineId || this.machineId,
      machineName: options.machineName || this.machineName,
      supportsRateLimitResponse: true,
      priorityReason: 11,
      accessToken: options.refreshToken,
    } as CMsgClientLogon;
    delete options.refreshToken;

    // setup response
    const loginRes = {
      machineName: options.machineName,
      machineId: options.machineId,
    } as LoginRes;

    let responses = [...LOGIN_RESPONSES];

    return new Promise(async (resolve, reject) => {
      // expect responses to be received before timeout
      const timeout = setTimeout(() => {
        this.disconnect();
        reject(new SteamClientError("Did not receive responses: " + responses.toString()));
      }, this.conn.timeout);

      const checkCanResolve = (receivedResponse: string) => {
        // remove received response
        responses = responses.filter((res) => res !== receivedResponse);
        if (responses.length) {
          return;
        }
        clearTimeout(timeout);
        // set extra peroperties to loginRes here
        loginRes.clientPlayingSessionState = this._playingSessionState;
        resolve(loginRes);
      };

      this.conn.once("ClientAccountInfo", async (body: CMsgClientAccountInfo) => {
        loginRes.clientAccountInfo = body;
        // it will eventually be caught by received responses
        try {
          loginRes.clientPersonaState = await this.setPersonaState(EPersonaState.Online);
        } catch (error) {
          return;
        }
        checkCanResolve("ClientAccountInfo");
      });

      this.conn.once("ClientEmailAddrInfo", (body: CMsgClientEmailAddrInfo) => {
        loginRes.clientEmailAddrInfo = body;
        checkCanResolve("ClientEmailAddrInfo");
      });

      this.conn.once("ClientIsLimitedAccount", (body: CMsgClientIsLimitedAccount) => {
        loginRes.clientIsLimitedAccount = body;
        checkCanResolve("ClientIsLimitedAccount");
      });

      this.conn.once("ClientVACBanStatus", (body) => {
        loginRes.clientVACBanStatus = body;
        checkCanResolve("ClientVACBanStatus");
      });

      // send login request to steam
      loginRes.rawResponse = await this.conn.sendProtoPromise(EMsg.ClientLogon, options, EMsg.ClientLogOnResponse);

      // good login
      if (loginRes.rawResponse.eresult === EResult.OK) {
        loginRes.steamId = loginRes.rawResponse.clientSuppliedSteamid.toString();
        loginRes.games = await this.service.player.getOwnedGames();
        loginRes.inventory = {
          steam: await this.service.econ.getSteamContextItems(),
        };

        checkCanResolve("SteamContextItems");
      } else {
        // bad login
        clearTimeout(timeout);
        this.disconnect();
        reject(new SteamClientError(EResultMap.get(loginRes.rawResponse.eresult)));
      }
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
  public setPersonaState(personaState: ValueOf<typeof EPersonaState>): Promise<Friend> {
    return this.changeStatus({ personaState: personaState });
  }

  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  public async gamesPlayed(
    gameIds: number[],
    options?: { forcePlay?: boolean }
  ): Promise<CMsgClientPlayingSessionState> {
    const playingBlocked = this.isPlayingBlocked;
    const playingGame = this.isPlayingGame;

    if (playingBlocked && !options?.forcePlay) {
      throw new SteamClientError("AlreadyPlayingElseWhere");
    }

    // kick another playing session before attemping to play in this session
    if (playingBlocked) {
      this.conn.sendProto(EMsg.ClientKickPlayingSession, {
        onlyStopGame: true,
      });
    }

    // not playing and trying to stop idle
    if (!playingGame && !gameIds.length) {
      throw new SteamClientError("CurrentlyNotPlaying");
    }

    const body: CMsgClientGamesPlayed = {
      gamesPlayed: gameIds.map((id) => {
        return { gameId: Long.fromInt(id, true) };
      }),
      clientOsType: EOSType.Win11,
    };

    const res = await this.conn.sendProtoPromise(EMsg.ClientGamesPlayed, body, EMsg.ClientPlayingSessionState);
    this._playingSessionState = res;
    return res;
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
      throw new SteamClientError(EResultMap.get(res.eresult));
    }

    if (!res.grantedAppids || !res.grantedAppids.length) return [];

    return this.service.player.getOwnedGames({
      appidsFilter: res.grantedAppids,
      includePlayedFreeGames: true,
    });
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
  private async changeStatus(body: {
    personaState?: ValueOf<typeof EPersonaState>;
    playerName?: string;
  }): Promise<Friend> {
    let somethingChanged = false;

    //  make sure something is actually changing
    if (!isEmpty(this.personaState)) {
      if (body.personaState) {
        if (body.personaState !== this.personaState.personaState) somethingChanged = true;
      }

      if (body.playerName) {
        if (body.playerName !== this.personaState.playerName) somethingChanged = true;
      }

      // nothing changed return old state
      if (!somethingChanged) return this.personaState;
    }

    const res = await this.conn.sendProtoPromise(EMsg.ClientChangeStatus, body, EMsg.ClientPersonaState);
    const friends = res.friends as Friend[];

    // return the status for this account
    for (const friend of friends) {
      if (friend.friendid.equals(this.steamId)) {
        return friend;
      }
    }

    throw new SteamClientError("ClientPersonaState did not return friend status.");
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

      // supply steamid to base connection
      this.conn.setSteamId(header.sub);
    } catch (error) {
      if (error instanceof SteamClientError) {
        throw error;
      }
      throw new SteamClientError("Refresh token is bad.");
    }
  }
}
