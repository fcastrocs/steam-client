import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
import SteamClientError from "./SteamClientError.js";
import { Language } from "./resources.js";
import Steam from "./Steam.js";
import { Game } from "../@types/steam.js";
import IActions from "../@types/Actions.js";
import { ClientPersonaState, Friend } from "../@types/protoResponse.js";
import { ClientChangeStatus } from "../@types/protoRequest.js";

export default class Actions implements IActions {
  private status: Friend;

  constructor(private steam: Steam) {}

  /**
   * Change player name or persona state
   */
  public async changeStatus(options: ClientChangeStatus): Promise<Friend> {
    const payload: {
      personaState?: number;
      playerName?: string;
    } = { playerName: options.playerName };

    let differentstate = 0;

    if (options.personaState) {
      payload.personaState = Language.EPersonaState[options.personaState];
      // check whether personaState changed
      if (this.status) if (payload.personaState !== this.status.personaState) differentstate++;
    }

    if (options.playerName) {
      payload.playerName = options.playerName;
      // check whether playerName changed
      if (this.status) if (payload.playerName !== this.status?.playerName) differentstate++;
    }

    // nothing changed return old status
    if (this.status) if (differentstate === 0) return this.status;

    const res: ClientPersonaState = await this.steam.sendProtoPromise(
      Language.EMsg.ClientChangeStatus,
      payload,
      Language.EMsg.ClientPersonaState
    );

    this.status = res.friends[0];

    return this.status;
  }

  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  public async idleGames(gameIds: number[], options?: { forcePlay?: boolean }) {
    if (this.steam.isPlayingBlocked && !options?.forcePlay) {
      throw new SteamClientError("AlreadyPlayingElseWhere");
    }

    // kick another playing session before attemping to play in this session
    if (this.steam.isPlayingBlocked) {
      this.steam.sendProto(Language.EMsg.ClientKickPlayingSession, { onlyStopGame: true });
    }

    const payload = {
      gamesPlayed: gameIds.map((id) => {
        return { gameId: id };
      }),
    };

    await this.steam.sendProtoPromise(
      Language.EMsg.ClientGamesPlayed,
      payload,
      Language.EMsg.ClientPlayingSessionState
    );
  }

  /**
   * Activate cdkey
   */
  public cdkeyRedeem(cdkey: string): Promise<Game[]> {
    this.steam.sendProto(Language.EMsg.ClientRegisterKey, { key: cdkey });

    return new Promise((resolve, reject) => {
      this.steam.once("ClientPurchaseResponse", async (res: T) => {
        // something went wrong
        if (res.eresult !== 1) {
          return reject(new SteamClientError(Language.EPurchaseResultMap.get(res.purchaseResultDetails)));
        }

        const receipt = (BinaryKVParser.parse(res.purchaseReceiptInfo) as T).MessageObject;
        // get packgeIds
        const packageIds = [];
        for (const item of receipt.lineitems) {
          const packageId = item.PackageID || item.packageID || item.packageid;
          if (!packageId) continue;
          packageIds.push(packageId);
        }

        const appIds = await this.steam.getAppIds(packageIds);
        const appInfo = await this.steam.getAppsInfo(appIds);
        return resolve(this.steam.getGames(appInfo));
      });
    });
  }

  /**
   * Activate free games
   */
  public activateFreeToPlayGames(appids: number[]): Promise<Game[]> {
    if (!appids.length) return Promise.resolve([]);

    this.steam.sendProto(Language.EMsg.ClientRequestFreeLicense, { appids });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new SteamClientError("DidNotGetResponse"));
      }, this.steam.timeout);

      this.steam.once("ClientRequestFreeLicenseResponse", async (res) => {
        clearTimeout(timeout);
        if (!res.grantedAppids.length) resolve([]);
        const appsInfo = await this.steam.getAppsInfo(res.grantedAppids);
        const games = this.steam.getGames(appsInfo);
        resolve(games);
      });
    });
  }
}
