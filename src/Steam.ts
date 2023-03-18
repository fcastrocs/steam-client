/**
 * Handles Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'PlayingState' when playing session changes.
 * 'ClientLoggedOff' unexpectedly when client logs off.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
const VDF = require("vdf");
import SteamCrypto from "@fcastrocs/steam-client-crypto";
import Connection from "./Connection.js";
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Player from "./services/Player.js";
import Econ from "./services/Econ.js";
import Client from "./Client.js";
import { Language } from "./resources.js";
import { AccountAuth, AccountData, Game, LoginOptions, LoginOptionsExtended } from "../@types/steam.js";
import { ConnectionOptions } from "../@types/connection.js";
import {
  AppBuffer,
  ClientAccountInfo,
  ClientEmailAddrInfo,
  ClientIsLimitedAccount,
  ClientLogonResponse,
  ClientPICSProductInfoResponse,
  ClientPlayingSessionState,
  PackageBuffer,
} from "../@types/protoResponse.js";

import { SteamClientError } from "./common.js";
import Long from "long";
export { SteamClientError };

export default class Steam extends Connection {
  public readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };
  public readonly client: Client;
  public readonly machineName: string;

  private loggedIn = false;
  private playingSessionState = {} as ClientPlayingSessionState;

  constructor(options: ConnectionOptions) {
    super(options);

    // inject dependencies
    this.service = {
      auth: new Auth(this),
      credentials: new Credentials(this),
      player: new Player(this),
      econ: new Econ(this),
    };
    this.client = new Client(this);

    // create machine name
    this.machineName = this.createMachineName();

    this.on("ClientPlayingSessionState", (body: ClientPlayingSessionState) => {
      this.playingSessionState = body;
      this.emit("PlayingStateChanged", body);
    });

    this.once("ClientLoggedOff", (body) => {
      this.disconnect();
      this.emit("AccountLoggedOff", Language.EResultMap.get(body.eresult));
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
      clientOsType: Language.EOSType.Win11,
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

    this.once("ClientAccountInfo", (body: ClientAccountInfo) => {
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
    const res: ClientLogonResponse = await this.sendProtoPromise(Language.EMsg.ClientLogon, options);

    if (res.eresult === Language.EResult.OK) {
      this.startHeartBeat(res.heartbeatSeconds);
      accountData.steamId = res.clientSuppliedSteamid.toString();
      accountData.games = await this.service.player.getOwnedGames(res.clientSuppliedSteamid);
      accountData.inventory.steam = await this.service.econ.getSteamContextItems();
      this.loggedIn = true;
    } else {
      this.disconnect();
      throw new SteamClientError(Language.EResultMap.get(res.eresult));
    }

    accountData.personaState = await this.client.setPersonaState("Online");

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
   * Disconnect user from Steam and kill connection
   */
  public disconnect() {
    this.destroyConnection();
  }

  /**
   * Whether user is logged in
   */
  public get isLoggedIn() {
    return this.loggedIn;
  }

  /**
   * Whether playing is blocked by another session
   */
  public get isPlayingBlocked() {
    return this.playingSessionState.playingBlocked;
  }

  public get isPlayingGame() {
    return !!this.playingSessionState.playingApp;
  }

  /**
   * returns account's steamId
   */
  public get steamId(): Long {
    return this.steamid;
  }

  /**
   * Get all appIds from packages
   */
  public getAppIds(packageIds: number[]): Promise<number[]> {
    // don't include default steam package id === 0
    packageIds = packageIds.filter((id) => id !== 0);

    if (!packageIds.length) return Promise.resolve([]);

    const packages = packageIds.map((id) => {
      return { packageid: id };
    });

    // send packge info request to steam
    this.sendProto(Language.EMsg.ClientPICSProductInfoRequest, { packages });

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

  /**
   * Get appsInfo from a list of appIds
   */
  public getAppsInfo(appIds: number[]): Promise<AppBuffer["appinfo"][]> {
    if (!appIds.length) return Promise.resolve([]);

    const apps = appIds.map((appid) => {
      return { appid };
    });

    // send apps info request to steam
    this.sendProto(Language.EMsg.ClientPICSProductInfoRequest, { apps });

    // wait for all(may come in Multi response) apps info responses
    return new Promise((resolve) => {
      const appsInfo: AppBuffer["appinfo"][] = [];

      this.on("ClientPICSProductInfoResponse", (res: ClientPICSProductInfoResponse) => {
        let timeout;
        clearTimeout(timeout);
        if (res.apps) {
          for (const app of res.apps) {
            const appBuffer: AppBuffer = VDF.parse(app.buffer.toString());

            const info = appBuffer.appinfo;
            if (!info) continue;
            appsInfo.push(info);
          }
        }

        // sometimes steam just doesn't send the last response with responsePending: false
        // wait 2500 seconds in between responses before counting operation as finished
        if (res.responsePending) {
          timeout = setTimeout(() => {
            this.removeAllListeners("ClientPICSProductInfoResponse");
            resolve(appsInfo);
          }, 4000);
        } else {
          clearTimeout(timeout);
          this.removeAllListeners("ClientPICSProductInfoResponse");
          resolve(appsInfo);
        }
      });
    });
  }

  /**
   * Get only games from appsInfo[]
   */
  public getGames(appsInfo: AppBuffer["appinfo"][]): Game[] {
    const games: Game[] = [];

    for (const app of appsInfo) {
      if (!app.common) continue;
      if (app.common.type.toLowerCase() !== "game") continue;

      games.push({
        name: app.common.name,
        icon: app.common.icon,
        gameid: Number(app.common.gameid),
        playtime: 0,
      });
    }

    // this may contain duplicates
    const set = new Set();
    // remove duplicates
    return games.filter((game) => {
      const seen = set.has(game.gameid);
      set.add(game.gameid);
      return !seen;
    });
  }

  private createMachineName(): string {
    const name = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5)
      .toUpperCase();
    return "DESKTOP-" + name + "-IDLE";
  }

  /**
   * Create a machineID based of accountName
   */
  private createMachineId(machineName: string): Buffer {
    // Machine IDs are binary KV objects with root key MessageObject and three hashes named BB3, FF2, and 3B3.

    // generate hash from machine name
    const hash = SteamCrypto.sha1Hash(machineName);

    const buffer = Buffer.alloc(155);
    buffer.writeInt8(0, 0); // 1 byte
    buffer.write("MessageObject", 1); // 14 bytes

    buffer.writeInt8(1, 15); // 1 byte
    buffer.write("BB3", 16); // 4 bytes
    buffer.write(hash, 20); // 41 bytes

    buffer.writeInt8(1, 61); // 1 byte
    buffer.write("FF2", 62); // 4 bytes
    buffer.write(hash, 66); // 41 bytes

    buffer.writeInt8(1, 107); // 1 byte
    buffer.write("3B3", 108); // 4 bytes
    buffer.write(hash, 112); // 41 bytes, total 153

    buffer.writeInt8(8, 153); // 1 byte
    buffer.writeInt8(8, 154); // 1 byte

    return buffer;
  }
}
