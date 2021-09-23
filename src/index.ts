/**
 * Manages high-level Steam operations
 *
 * Emits the following:
 * 'disconnected' when connection is lost.
 * 'loginkey' emits loginkey when it is accepted.
 *
 */

import Connection from "./connection";
import resources from "./resources/";
import SteamCrypto from "steam-crypto-ts";
const VDF = require("vdf");
const BinaryKVParser = require("binarykvparser");

const Language = resources.language;
const PROTOCOL_VERSION = 65580;

export default class Steam extends Connection {
  private loggedIn = false;
  
  constructor() {
    super();

    // catch 'socket disconnected' event and emit 'disconected' only if user logged in
    this.on("socket disconnected", () => {
      if (this.loggedIn) this.emit("disconnected");
    });
  }

  /**
   * Login to Steam
   */
  public login(options: LoginOptions): Promise<{ auth: AccountAuth; data: AccountData }> {
    if (!this.isConnectionReady()) throw new Error("Not connected to steam.");
    // set up default login options
    options.clientOsType = Language.EOSType.Windows10;
    options.shouldRememberPassword = true;
    options.protocolVersion = PROTOCOL_VERSION;
    options.supportsRateLimitResponse = true;
    options.machineId = this.createMachineID(options.accountName);
    options.machineName = options.machineName || this.createMachineName();
    // don't include password when using loginkey because it's not needed
    const password = options.password;
    if (options.loginKey) {
      delete options.password;
    }

    // send login request to steam
    this.send(options, Language.EMsg.ClientLogon);

    // wait for all account data
    return new Promise((resolve, reject) => {
      let responses = [
        "CMsgClientLogonResponse",
        "CMsgClientChangeStatus",
        "CMsgClientIsLimitedAccount",
        "CMsgClientVACBanStatus",
        "CMsgClientPersonaState",
        "CMsgClientAccountInfo",
        "CMsgClientLicenseList",
      ];

      // expect responses to occur before timeout
      const loginTimeoutId = setTimeout(() => {
        this.destroyConnection(true);
        reject(responses);
      }, this.getTimeout());

      // extra responses needed of only provided password
      if (!options.shaSentryfile || !options.loginKey) {
        responses.push("CMsgClientNewLoginKey");
        responses.push("CMsgClientUpdateMachineAuth");
      }

      let webNonce: string;
      let steamId: string;
      let loginKey = options.loginKey;
      let limited: boolean;
      let communityBanned: boolean;
      let locked: boolean;
      let vac: boolean;
      let nickname: string;
      let avatar: string;
      let games: Game[] = [];
      let sentry: Buffer;

      // catch responses
      this.once("CMsgClientLogonResponse", async (body) => {
        if (body.eresult === Language.EResult.OK) {
          this.startHeartBeat(body.outOfGameHeartbeatSeconds);
          webNonce = body.webapiAuthenticateUserNonce;
          steamId = body.clientSuppliedSteamid.toString();
        } else {
          clearTimeout(loginTimeoutId);
          this.destroyConnection();
          return reject(Language.EResult[body.eresult]);
        }

        // set online status
        checkCanResolve("CMsgClientLogonResponse");
        this.clientChangeStatus({
          personaState: Language.EPersonaState.Online,
        });
        checkCanResolve("CMsgClientChangeStatus");
      });

      this.on("CMsgClientNewLoginKey", (body) => {
        this.send(body, Language.EMsg.ClientNewLoginKeyAccepted);
        loginKey = body.loginKey;
        if (responses.includes("CMsgClientNewLoginKey")) {
          checkCanResolve("CMsgClientNewLoginKey");
        }
      });

      this.once("CMsgClientIsLimitedAccount", (body) => {
        limited = body.bisLimitedAccount;
        communityBanned = body.bisCommunityBanned;
        locked = body.bisLockedAccount;
        checkCanResolve("CMsgClientIsLimitedAccount");
      });

      this.once("CMsgClientVACBanStatus", (body) => {
        vac = body.vacbanned;
        checkCanResolve("CMsgClientVACBanStatus");
      });

      this.once("CMsgClientPersonaState", (body) => {
        avatar = this.getAvatar(body);
        checkCanResolve("CMsgClientPersonaState");
      });

      this.once("CMsgClientAccountInfo", (body) => {
        nickname = body.personaName;
        checkCanResolve("CMsgClientAccountInfo");
        // no steam guard, don't wait for sentry
        if (body.twoFactorState === 0) {
          checkCanResolve("CMsgClientUpdateMachineAuth");
        }
      });

      this.once("CMsgClientLicenseList", async (body) => {
        const packageIds = [];
        for (const license of body.licenses) {
          packageIds.push(license.packageId);
        }

        // get packages Info
        const packagesInfo = await this.getPackagesInfo(packageIds);
        if (packagesInfo.length === 0) {
          checkCanResolve("CMsgClientLicenseList");
          return;
        }

        const appIds = [];
        for (const pkg of packagesInfo) {
          for (const appid of pkg.appids) {
            appIds.push(appid);
          }
        }

        // get apps info
        const appsInfo = await this.getAppsInfo(appIds);
        if (appsInfo.length === 0) {
          checkCanResolve("CMsgClientLicenseList");
          return;
        }

        games = this.getGames(appsInfo);
        checkCanResolve("CMsgClientLicenseList");
      });

      if (!options.shaSentryfile) {
        this.once("CMsgClientUpdateMachineAuth", (body) => {
          // not emmited if using a sentry file
          sentry = this.clientUpdateMachineAuthResponse(body.bytes);
          checkCanResolve("CMsgClientUpdateMachineAuth");
        });
      }

      // check if this promise can be resolved
      const checkCanResolve = (response: string) => {
        // remove this response from array
        responses = responses.filter((item) => item !== response);

        if (responses.length !== 0) return;

        // no more responses left, finally return from login()
        clearTimeout(loginTimeoutId);

        const loginRes: { auth: AccountAuth; data: AccountData } = {
          auth: {
            sentry: sentry || options.shaSentryfile,
            loginKey: loginKey || options.loginKey || "",
            machineName: options.machineName || "",
            webNonce,
          },
          data: {
            steamId,
            limited,
            vac,
            avatar,
            nickname,
            communityBanned,
            locked,
            games,
          },
        };

        this.loggedIn = true;
        resolve(loginRes);
      };
    });
  }

  /**
   * Change persona name or status
   */
  public clientChangeStatus(body: ChangeStatusOption): void {
    this.send(body, Language.EMsg.ClientChangeStatus);
  }

  /**
   * Idle an array of appIds
   * empty array stops idling
   */
  public clientGamesPlayed(appIds: number[]): void {
    const body: GamesPlayedOption = {
      gamesPlayed: [],
    };

    for (const appId of appIds) {
      body.gamesPlayed.push({ gameId: appId });
    }

    this.send(body, Language.EMsg.ClientGamesPlayed);
  }

  /**
   * Activate free games
   */
  public clientRequestFreeLicense(appIds: number[]): Promise<Game[]> {
    if (appIds.length === 0) return Promise.resolve([]);

    const body: RequestFreeLicenseOption = {
      appids: [],
    };

    for (const appId of appIds) {
      body.appids.push(appId);
    }

    this.send(body, Language.EMsg.ClientRequestFreeLicense);

    return new Promise((resolve) => {
      this.once("CMsgClientRequestFreeLicenseResponse", async (res) => {
        if (res.grantedAppids.length === 0) resolve([]);
        const appsInfo = await this.getAppsInfo(res.grantedAppids);
        const games = this.getGames(appsInfo);
        resolve(games);
      });
    });
  }

  /**
   * Get avatar from CMsgClientPersonaState response
   */
  private getAvatar(body: { friends: Array<{ avatarHash: Buffer }> }) {
    const url = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars";
    let avatarHash = "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"; //default avatar

    const hash = body.friends[0].avatarHash.toString("hex");
    //default avatar
    if (hash !== "0000000000000000000000000000000000000000") {
      avatarHash = hash;
    }
    return `${url}/${avatarHash.substring(0, 2)}/${avatarHash}_full.jpg`;
  }

  /**
   * Get packagesInfo from a list of packageIds
   */
  private getPackagesInfo(packageIds: number[]): Promise<PackageInfo[]> {
    const packages: { packageid: number }[] = [];

    // don't include default steam package
    for (const id of packageIds) {
      // don't include default steam package
      if (id === 0) continue;
      packages.push({ packageid: id });
    }

    if (packages.length === 0) return Promise.resolve([]);

    // send packge info request to steam
    this.send({ packages }, Language.EMsg.ClientPICSProductInfoRequest);

    // wait for all(may con in Multi response) packages info responses
    return new Promise((resolve) => {
      const packagesInfo: PackageInfo[] = [];
      let missingTokens = 0;

      this.on("CMsgClientPICSProductInfoResponse", (data) => {
        for (const pkg of data.packages) {
          if (pkg.missingToken) {
            missingTokens++;
            continue;
          }
          packagesInfo.push(BinaryKVParser.parse(pkg.buffer)[pkg.packageid]);
        }

        if (packagesInfo.length === packages.length - missingTokens) {
          this.removeAllListeners("CMsgClientPICSProductInfoResponse");
          resolve(packagesInfo);
        }
      });
    });
  }

  /**
   * Get appsInfo from a list of appIds
   */
  private getAppsInfo(appIds: number[]): Promise<AppInfo[]> {
    const apps: { appid: number }[] = [];

    // get apps
    for (const id of appIds) {
      apps.push({ appid: id });
    }

    if (apps.length === 0) return Promise.resolve([]);

    // send apps info request to steam
    this.send({ apps }, Language.EMsg.ClientPICSProductInfoRequest);

    // wait for all(may come in Multi response) apps info responses
    return new Promise((resolve) => {
      const appsInfo: AppInfo[] = [];

      this.on("CMsgClientPICSProductInfoResponse", (data) => {
        // did not receive any apps.
        if (!data.apps) {
          return resolve([]);
        }

        for (const app of data.apps) {
          appsInfo.push(VDF.parse(app.buffer.toString()).appinfo);
        }

        if (appsInfo.length === apps.length) {
          this.removeAllListeners("CMsgClientPICSProductInfoResponse");
          resolve(appsInfo);
        }
      });
    });
  }

  /**
   * Parse appsInfo into a nice games array
   */
  private getGames(appsInfo: AppInfo[]): Game[] {
    const games = [];
    for (const app of appsInfo) {
      if (!app.common) continue;
      if (app.common.type.toLowerCase() !== "game") continue;
      games.push({
        name: app.common.name,
        appid: app.appid,
        logo: app.common.logo,
      });
    }
    return games;
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
  private clientUpdateMachineAuthResponse(sentry: Buffer): sentry {
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
      .substr(0, 5)
      .toUpperCase();
    return "DESKTOP-" + name;
  }
}
