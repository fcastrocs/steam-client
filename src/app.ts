/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' loginkey when it is accepted.
 *
 */

import Connection from "./connection.js";
import resources from "./resources/index.js";
import SteamCrypto from "steam-crypto-esm";
import {
  Options,
  LoginOptions,
  AccountAuth,
  AccountData,
  PackageInfo,
  AppInfo,
  Sentry,
  State,
  PersonaStateResponse,
  ProductInfoResponse,
  PackageBuffer,
  AppBuffer,
  ClientPurchaseResponse,
  PurchaseReceiptInfo,
  SteamAccount,
} from "../@types";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
const VDF = require("vdf");

const PersonaState = {
  offline: 0,
  online: 1,
  busy: 2,
  away: 3,
  snooze: 4,
} as const;

const Language = resources.language;
const PROTOCOL_VERSION = 65580;

export default class Steam extends Connection {
  private personaState = 1;
  constructor(options: Options) {
    super(options);
  }

  /**
   * Login to Steam
   */
  public login(options: LoginOptions): Promise<SteamAccount> {
    if (this.connectionDestroyed) throw new SteamClientError("NotSteamConnection");
    // set up default login options
    options.clientOsType = Language.EOSType.Windows10;
    options.shouldRememberPassword = true;
    options.protocolVersion = PROTOCOL_VERSION;
    options.supportsRateLimitResponse = true;
    options.machineId = this.createMachineID(options.accountName);

    // don't include password when using loginkey because it's not needed
    if (options.loginKey) delete options.password;

    const accountData = {
      games: [],
    } as AccountData;

    const accountAuth = {
      loginKey: options.loginKey,
      sentry: options.shaSentryfile,
      machineName: options.machineName || this.createMachineName(),
    } as AccountAuth;

    // send login request to steam
    this.send(options, Language.EMsg.ClientLogon);

    // wait for all account data
    return new Promise((resolve, reject) => {
      let responses = [
        "CMsgClientLogonResponse",
        "CMsgClientIsLimitedAccount",
        "CMsgClientVACBanStatus",
        "CMsgClientPersonaState",
        "CMsgClientAccountInfo",
        "CMsgClientLicenseList",
        "CMsgClientEmailAddrInfo",
      ];

      // expect a sentry if options did not provide one.
      if (!options.shaSentryfile) responses.push("CMsgClientUpdateMachineAuth");

      // expect a loginKey if options did not provide one
      if (!options.loginKey) responses.push("CMsgClientNewLoginKey");

      // expect responses to occur before timeout
      const loginTimeoutId = setTimeout(() => {
        this.disconnect();
        reject(new SteamClientError(responses.toString()));
      }, this.timeout);

      // catch responses
      this.once("CMsgClientLogonResponse", (body) => {
        if (body.eresult === Language.EResult.OK) {
          this.startHeartBeat(body.outOfGameHeartbeatSeconds);
          accountAuth.webNonce = body.webapiAuthenticateUserNonce;
          accountData.steamId = body.clientSuppliedSteamid.toString();
        } else {
          accountData.emailOrDomain = body.emailDomain;
          clearTimeout(loginTimeoutId);
          this.disconnect();
          return reject(new SteamClientError(Language.EResult[body.eresult]));
        }
        // set online state this will trigger CMsgClientPersonaState
        this.changePersonaState("online");
        checkCanResolve("CMsgClientLogonResponse");
      });

      this.on("CMsgClientNewLoginKey", (body) => {
        this.send(body, Language.EMsg.ClientNewLoginKeyAccepted);
        accountAuth.loginKey = body.loginKey;

        // maybe steam sends a loginKey randomly, when not expecting one
        if (responses.includes("CMsgClientNewLoginKey")) {
          checkCanResolve("CMsgClientNewLoginKey");
        } else {
          // emit it so it can be handled approperly.
          this.emit("loginKey", accountAuth.loginKey);
        }
      });

      this.once("CMsgClientUpdateMachineAuth", (body) => {
        accountAuth.sentry = this.clientUpdateMachineAuthResponse(body.bytes);
        checkCanResolve("CMsgClientUpdateMachineAuth");
      });

      this.once("CMsgClientIsLimitedAccount", (body) => {
        accountData.limited = body.bisLimitedAccount;
        accountData.communityBanned = body.bisCommunityBanned;
        accountData.locked = body.bisLockedAccount;
        checkCanResolve("CMsgClientIsLimitedAccount");
      });

      this.once("CMsgClientVACBanStatus", (body) => {
        accountData.vac = body.vacbanned;
        checkCanResolve("CMsgClientVACBanStatus");
      });

      this.once("CMsgClientPersonaState", (body) => {
        accountData.avatar = this.getAvatar(body.friends[0] as PersonaStateResponse);
        checkCanResolve("CMsgClientPersonaState");
      });

      this.once("CMsgClientAccountInfo", (body) => {
        accountData.nickname = body.personaName;
        checkCanResolve("CMsgClientAccountInfo");
        // if no steam guard steam will not send sentry, but will still send loginKey
        if (!body.twoFactorState) checkCanResolve("CMsgClientUpdateMachineAuth");
      });

      this.once("CMsgClientEmailAddrInfo", (body) => {
        accountData.emailVerified = body.emailIsValidated;
        accountData.emailOrDomain = body.emailAddress;
        accountData.secure = body.credentialChangeRequiresCode;
        checkCanResolve("CMsgClientEmailAddrInfo");
      });

      this.once("CMsgClientLicenseList", async (body) => {
        const packageIds = [];
        for (const license of body.licenses) {
          packageIds.push(license.packageId);
        }

        // get packages Info
        const packagesInfo = await this.getPackagesInfo(packageIds);
        if (!packagesInfo.length) return checkCanResolve("CMsgClientLicenseList");

        // get all appids from
        const appIds = [];
        for (const pkg of packagesInfo) {
          for (const id of pkg.appids) {
            appIds.push(id);
          }
        }

        // get apps info
        const appsInfo = await this.getAppsInfo(appIds);
        if (!appsInfo.length) return checkCanResolve("CMsgClientLicenseList");

        accountData.games = this.getGames(appsInfo);
        checkCanResolve("CMsgClientLicenseList");
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

  /**
   * Get a web api nonce to login to steamcommunity
   */
  public getWebNonce(): Promise<string> {
    this.send({}, Language.EMsg.ClientRequestWebAPIAuthenticateUserNonce);
    return new Promise((resolve, reject) => {
      // expect response by timeout, otherwise reject
      const timeout = setTimeout(() => reject(new SteamClientError("WebNonceNotReceived")), this.timeout);

      this.once("CMsgClientRequestWebAPIAuthenticateUserNonceResponse", (res) => {
        clearTimeout(timeout);
        resolve(res.webapiAuthenticateUserNonce);
      });
    });
  }

  /**
   * Change change player Name
   */
  public changePlayerName(name: string) {
    this.send({ playerName: name, personaState: this.personaState }, Language.EMsg.ClientChangeStatus);
  }

  /**
   * Change persona state
   */
  public changePersonaState(state: State) {
    this.send({ personaState: PersonaState[state] }, Language.EMsg.ClientChangeStatus);
    this.personaState = PersonaState[state];
  }

  /**
   * Idle an array of appIds
   * empty array stops idling
   */
  public idleGames(gameIds: number[]) {
    const body = {
      gamesPlayed: gameIds.map((id) => {
        return { gameId: id };
      }),
    };
    this.send(body, Language.EMsg.ClientGamesPlayed);
  }

  /**
   * Activate cdkey
   */
  public cdkeyRedeem(cdkey: string): Promise<AppInfo[]> {
    this.send({ key: cdkey }, Language.EMsg.ClientRegisterKey);

    return new Promise((resolve, reject) => {
      this.once("CMsgClientPurchaseResponse", async (res: ClientPurchaseResponse) => {
        // something went wrong
        if (res.eresult !== 1) {
          return reject(new SteamClientError(Language.EPurchaseResult[res.purchaseResultDetails]));
        }

        const receipt = (BinaryKVParser.parse(res.purchaseReceiptInfo) as PurchaseReceiptInfo).MessageObject;
        // get packgeIds
        const packageIds = [];
        for (const item of receipt.lineitems) {
          const packageId = item.PackageID || item.packageID || item.packageid;
          if (!packageId) continue;
          packageIds.push(packageId);
        }

        const packageInfo = await this.getPackagesInfo(packageIds);

        // get appIds
        let appIds: number[] = [];
        for (const pkg of packageInfo) {
          appIds = appIds.concat(pkg.appids);
        }

        const appInfo = await this.getAppsInfo(appIds);
        return resolve(this.getGames(appInfo));
      });
    });
  }

  /**
   * Activate free games
   */
  public activateFreeToPlayGames(appids: number[]): Promise<AppInfo[]> {
    if (!appids.length) return Promise.resolve([]);

    const body = {
      appids,
    };

    this.send(body, Language.EMsg.ClientRequestFreeLicense);

    return new Promise((resolve) => {
      this.once("CMsgClientRequestFreeLicenseResponse", async (res) => {
        if (!res.grantedAppids.length) resolve([]);
        const appsInfo = await this.getAppsInfo(res.grantedAppids);
        const games = this.getGames(appsInfo);
        resolve(games);
      });
    });
  }

  /**
   * Get avatar from CMsgClientPersonaState response
   */
  private getAvatar(body: PersonaStateResponse): string {
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
   * Get packagesInfo from a list of packageIds
   */
  public getPackagesInfo(packageIds: number[]): Promise<PackageInfo[]> {
    // don't include default steam package id === 0
    packageIds = packageIds.filter((id) => id !== 0);

    if (!packageIds.length) return Promise.resolve([]);

    const packages = packageIds.map((id) => {
      return { packageid: id };
    });

    // send packge info request to steam
    this.send({ packages }, Language.EMsg.ClientPICSProductInfoRequest);

    // wait for all(Multi response) packages info
    return new Promise((resolve) => {
      const packagesInfo: PackageInfo[] = [];

      this.on("CMsgClientPICSProductInfoResponse", (res: ProductInfoResponse) => {
        if (res.packages) {
          for (const pkg of res.packages) {
            // package not fully received
            if (pkg.missingToken) {
              continue;
            }
            const packageBuffer: PackageBuffer = BinaryKVParser.parse(pkg.buffer);
            packagesInfo.push(packageBuffer[pkg.packageid]);
          }
        }

        // received all packages info
        if (!res.responsePending) {
          this.removeAllListeners("CMsgClientPICSProductInfoResponse");
          resolve(packagesInfo);
        }
      });
    });
  }

  /**
   * Get appsInfo from a list of appIds
   */
  public getAppsInfo(appIds: number[]): Promise<AppInfo[]> {
    if (!appIds.length) return Promise.resolve([]);

    const apps = appIds.map((id) => {
      return { appid: id };
    });

    // send apps info request to steam
    this.send({ apps }, Language.EMsg.ClientPICSProductInfoRequest);

    // wait for all(may come in Multi response) apps info responses
    return new Promise((resolve) => {
      const appsInfo: AppInfo[] = [];

      this.on("CMsgClientPICSProductInfoResponse", (res: ProductInfoResponse) => {
        if (res.apps) {
          for (const app of res.apps) {
            const appBuffer: AppBuffer = VDF.parse(app.buffer.toString());
            const info = appBuffer.appinfo.common;
            if (!info) continue;
            appsInfo.push(info);
          }
        }

        if (!res.responsePending) {
          this.removeAllListeners("CMsgClientPICSProductInfoResponse");
          resolve(appsInfo);
        }
      });
    });
  }

  /**
   * get games from AppInfo[]
   */
  private getGames(appsInfo: AppInfo[]): AppInfo[] {
    const games = [];
    for (const app of appsInfo) {
      if (app.type.toLowerCase() !== "game") continue;
      games.push({
        logo: app.logo,
        logo_small: app.logo_small,
        name: app.name,
        type: app.type.toLowerCase(),
        gameid: Number(app.gameid),
      } as AppInfo);
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

  /**
   * Create a machineID based of accountName
   */
  private createMachineID(accountName: string): Buffer {
    // Machine IDs are binary KV objects with root key MessageObject and three hashes named BB3, FF2, and 3B3.

    // generate hash from accountName
    const hash = SteamCrypto.sha1(accountName);

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

  /**
   * Accept sentry
   */
  private clientUpdateMachineAuthResponse(sentry: Buffer): Sentry {
    const stringHex = SteamCrypto.sha1(sentry);
    const buffer = Buffer.from(stringHex, "hex");
    this.send({ shaFile: buffer }, Language.EMsg.ClientUpdateMachineAuthResponse);
    return buffer;
  }

  /**
   * Create a random machine name
   */
  private createMachineName(): string {
    const name = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5)
      .toUpperCase();
    return "DESKTOP-" + name;
  }
}

export class SteamClientError extends Error {
  constructor(message: string) {
    super(message);
    super.name = "steam-client";
  }
}
