/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' loginkey when it is accepted.
 *
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
const VDF = require("vdf");
import SteamCrypto from "@machiavelli/steam-client-crypto";
import Connection from "./Connection.js";
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Actions from "./Actions.js";
import { Language } from "./resources.js";
import ISteam, { AccountAuth, AccountData, Game, LoginOptions } from "../@types/steam.js";
import { ConnectionOptions } from "../@types/connection.js";
import {
  AppBuffer,
  ClientAccountInfo,
  ClientEmailAddrInfo,
  ClientIsLimitedAccount,
  ClientLicenseList,
  ClientLogonResponse,
  ClientPersonaState,
  ClientPICSProductInfoResponse,
  ClientPlayingSessionState,
  ClientUpdateMachineAuth,
  Friend,
  PackageBuffer,
} from "../@types/protoResponse.js";

import SteamClientError from "./SteamClientError.js";
import IActions from "../@types/Actions.js";
import ICredentials from "../@types/services/credentials.js";
import IAuth from "../@types/services/auth.js";

export default class Steam extends Connection implements ISteam {
  public readonly service: {
    auth: IAuth;
    credentials: ICredentials;
  };
  public readonly action: IActions;
  public readonly machineName: string;

  private loggedIn = false;
  private playingBlocked = false;

  constructor(options: ConnectionOptions) {
    super(options);
    // inject dependencies
    this.service = {
      auth: new Auth(this),
      credentials: new Credentials(this),
    };

    this.action = new Actions(this);

    // create machine name
    this.machineName = this.createMachineName();

    // catch events
    this.on("ClientPlayingSessionState", (body: ClientPlayingSessionState) => {
      this.playingBlocked = body.playingBlocked;
      this.emit("playingBlocked", this.playingBlocked);
    });

    this.once("ClientLoggedOff", (body) => {
      this.disconnect();
      this.emit("ClientLoggedOff", body);
    });
  }

  public disconnect() {
    this.destroyConnection();
  }

  public login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }> {
    // set up default login options
    options.clientOsType = Language.EOSType.Win11;
    options.protocolVersion = 65580;
    options.supportsRateLimitResponse = true;
    options.shouldRememberPassword = true;
    options.machineName = options.machineName || this.machineName;
    options.machineId = options.machineId || this.createMachineId(options.machineName);

    const accountData = {
      games: [],
    } as AccountData;

    const accountAuth = {
      machineName: options.machineName,
      machineId: options.machineId,
    } as AccountAuth;

    // send login request to steam
    this.send({ EMsg: Language.EMsg.ClientLogon, payload: options });

    // wait for all account data
    return new Promise((resolve, reject) => {
      let responses = [
        "ClientLogonResponse",
        "ClientAccountInfo",
        "ClientEmailAddrInfo",
        "ClientLicenseList",
        "ClientIsLimitedAccount",
        "ClientVACBanStatus",
        "ClientPersonaState",
      ];

      // expect responses to occur before timeout
      const loginTimeoutId = setTimeout(() => {
        this.disconnect();
        reject(new SteamClientError(responses.toString()));
      }, this.timeout);

      // catch responses
      this.once("ClientLogonResponse", (body: ClientLogonResponse) => {
        if (body.eresult === Language.EResult.OK) {
          this.startHeartBeat(body.heartbeatSeconds);
          accountAuth.webNonce = body.webapiAuthenticateUserNonce;
          accountData.steamId = body.clientSuppliedSteamid.toString();
          accountAuth.tokenId = body.tokenId;

          accountData.isSteamGuardEnabled = !!(
            options.accessToken ||
            (options.password && (options.authCode || options.twoFactorCode))
          );

          // sentry is emitted if guard is enabled, and sentry not passed
          if (accountData.isSteamGuardEnabled && !options.shaSentryfile && !options.accessToken) {
            responses.push("ClientUpdateMachineAuth");
          }
        } else {
          clearTimeout(loginTimeoutId);
          this.disconnect();
          return reject(new SteamClientError(Language.EResultMap.get(body.eresult)));
        }
        // set online state this will trigger ClientPersonaState
        this.action.changePersonaState("Online");
        checkCanResolve("ClientLogonResponse");
      });

      this.once("ClientUpdateMachineAuth", (body: ClientUpdateMachineAuth) => {
        accountAuth.sentry = this.clientUpdateMachineAuthResponse(body.bytes);
        checkCanResolve("ClientUpdateMachineAuth");
      });

      this.once("ClientAccountInfo", (body: ClientAccountInfo) => {
        accountData.personaName = body.personaName;
        checkCanResolve("ClientAccountInfo");
      });

      this.once("ClientEmailAddrInfo", (body: ClientEmailAddrInfo) => {
        accountData.isEmailVerified = body.emailIsValidated;
        accountData.emailOrDomain = body.emailAddress;
        accountData.credentialChangeRequiresCode = body.credentialChangeRequiresCode;
        checkCanResolve("ClientEmailAddrInfo");
      });

      this.once("ClientLicenseList", async (body: ClientLicenseList) => {
        const packageIds = [];

        for (const license of body.licenses) {
          packageIds.push(license.packageId);
        }

        // get packages Info
        const appIds = await this.getAppIds(packageIds);
        if (!appIds.length) return checkCanResolve("ClientLicenseList");

        // get apps info
        const appsInfo = await this.getAppsInfo(appIds);
        if (!appsInfo.length) return checkCanResolve("ClientLicenseList");

        accountData.games = this.getGames(appsInfo);

        checkCanResolve("ClientLicenseList");
      });

      this.once("ClientIsLimitedAccount", (body: ClientIsLimitedAccount) => {
        accountData.limited = body.bisLimitedAccount;
        accountData.communityBanned = body.bisCommunityBanned;
        accountData.locked = body.bisLockedAccount;
        checkCanResolve("ClientIsLimitedAccount");
      });

      this.once("ClientVACBanStatus", (body) => {
        accountData.vac = body.vac;
        checkCanResolve("ClientVACBanStatus");
      });

      this.once("ClientPersonaState", (body: ClientPersonaState) => {
        accountData.avatar = this.getAvatar(body.friends[0]);
        checkCanResolve("ClientPersonaState");
      });

      // check if this promise can be resolved
      const checkCanResolve = (response: string) => {
        // remove this response from array
        responses = responses.filter((item) => item !== response);
        //  there are still responses left
        if (responses.length) return;

        // no more responses left, finally return from login()
        clearTimeout(loginTimeoutId);
        resolve({ auth: accountAuth, data: accountData });
      };
    });
  }

  public get isLoggedIn() {
    return this.loggedIn;
  }

  public get isPlayingBlocked() {
    return this.playingBlocked;
  }

  private getAvatar(body: Friend): string {
    const url = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars";
    let avatarHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"; //default avatar

    const hash = body.avatarHash.toString("hex");
    //default avatar
    if (hash !== "0000000000000000000000000000000000000000") {
      avatarHash = hash;
    }
    return `${url}/${avatarHash.substring(0, 2)}/${avatarHash}_full.jpg`;
  }

  /**
   * Get all appIds from packages
   */
  public getAppIds(packageIds: number[]): Promise<{ appid: number }[]> {
    // don't include default steam package id === 0
    packageIds = packageIds.filter((id) => id !== 0);

    if (!packageIds.length) return Promise.resolve([]);

    const packages = packageIds.map((id) => {
      return { packageid: id };
    });

    // send packge info request to steam
    this.send({
      EMsg: Language.EMsg.ClientPICSProductInfoRequest,
      payload: { packages },
    });

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
          resolve(
            [...new Set(appIds)].map((id) => {
              return { appid: id };
            })
          );
        }
      });
    });
  }

  /**
   * Get appsInfo from a list of appIds
   */
  public getAppsInfo(apps: { appid: number }[]): Promise<AppBuffer["appinfo"][]> {
    if (!apps.length) return Promise.resolve([]);

    // send apps info request to steam
    this.send({
      EMsg: Language.EMsg.ClientPICSProductInfoRequest,
      payload: { apps },
    });

    // wait for all(may come in Multi response) apps info responses
    return new Promise((resolve) => {
      const appsInfo: AppBuffer["appinfo"][] = [];

      this.on("ClientPICSProductInfoResponse", (res: ClientPICSProductInfoResponse) => {
        if (res.apps) {
          for (const app of res.apps) {
            const appBuffer: AppBuffer = VDF.parse(app.buffer.toString());

            const info = appBuffer.appinfo;
            if (!info) continue;
            appsInfo.push(info);
          }
        }

        if (!res.responsePending) {
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
        logo: app.common.logo,
        logo_small: app.common.logo_small,
        icon: app.common.icon,
        clienticon: app.common.clienticon,
        clienttga: app.common.clienttga,
        gameid: Number(app.common.gameid),
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

  private clientUpdateMachineAuthResponse(sentryBytes: ClientUpdateMachineAuth["bytes"]) {
    const stringHex = SteamCrypto.sha1Hash(sentryBytes);
    const buffer = Buffer.from(stringHex, "hex");

    this.send({
      EMsg: Language.EMsg.ClientUpdateMachineAuthResponse,
      payload: { shaFile: buffer },
    });

    return buffer;
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
