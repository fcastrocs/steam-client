import { createRequire } from "module";
const require = createRequire(import.meta.url);
const BinaryKVParser = require("binarykvparser");
import SteamClientError from "./SteamClientError.js";
import { Language } from "./resources.js";
import Steam from "./Steam.js";
import { Game } from "../@types/steam.js";
import IClient from "../@types/client.d.js";
import {
  ClientPersonaState,
  ClientPurchaseRes,
  ClientRequestFreeLicenseRes,
  Friend,
  PurchaseReceiptInfo,
} from "../@types/protoResponse.js";

export default class Client implements IClient {
  private state: Friend;

  constructor(private steam: Steam) {
    // catch changes to personaState, playerName or avatar
    this.steam.on("ClientPersonaState", (body: ClientPersonaState) => {
      // have never received status
      if (!this.state) {
        this.state = body.friends[0];
        this.steam.emit("PersonaStateChanged", this.state);
        return;
      }

      const state = body.friends[0];

      // not this user
      if (state.friendid.notEquals(this.state.friendid)) return;

      let somethingChanged = false;

      // check if playerName, personaState or avatar changed
      if (
        state.avatarHash.toString("hex") !== this.state.avatarHash.toString("hex") ||
        state.personaState !== this.state.personaState ||
        state.playerName !== this.state.playerName
      ) {
        somethingChanged = true;
      }

      if (somethingChanged) {
        this.state = state;
        this.steam.emit("PersonaStateChanged", this.state);
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
  public setPersonaState(personaState: keyof typeof Language.EPersonaState): Promise<Friend> {
    return this.changeStatus({ personaState: Language.EPersonaState[personaState] });
  }

  /**
   * Change player name or persona state
   */
  private async changeStatus(payload: ClientChangeStatus): Promise<Friend> {
    let somethingChanged = false;

    if (payload.personaState) {
      // whether a change is being made
      if (this.state) if (payload.personaState !== this.state.personaState) somethingChanged = true;
    } else {
      // whether a change is being made
      if (this.state) if (payload.playerName !== this.state?.playerName) somethingChanged = true;
    }

    // nothing changed return old state
    if (this.state) if (!somethingChanged) return this.state;

    this.steam.sendProto(Language.EMsg.ClientChangeStatus, payload);

    return new Promise((resolve) => {
      this.steam.once("PersonaStateChanged", (state: Friend) => {
        return resolve(state);
      });
    });
  }

  /**
   * Idle an array of appIds
   * Empty array stops idling
   * forcePlay truthy kicks another playing session
   */
  public async gamesPlayed(gameIds: number[], options?: { forcePlay?: boolean }) {
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
  public async registerKey(cdkey: string): Promise<Game[]> {
    const res: ClientPurchaseRes = await this.steam.sendProtoPromise(
      Language.EMsg.ClientRegisterKey,
      { key: cdkey },
      Language.EMsg.ClientPurchaseResponse
    );

    // something went wrong
    if (res.eresult !== Language.EResult.OK) {
      throw new SteamClientError(Language.EPurchaseResultMap.get(res.purchaseResultDetails));
    }

    const receipt = (BinaryKVParser.parse(res.purchaseReceiptInfo) as PurchaseReceiptInfo).MessageObject;
    // get packgeIds
    const packageIds = [];
    for (const item of receipt.lineitems) {
      const packageId = item.PackageID || item.packageID || item.packageid;
      if (!packageId) continue;
      packageIds.push(packageId);
    }

    const appIds = await this.steam.getAppIds(packageIds);
    const appInfo = await this.steam.getAppsInfo(appIds);
    return this.steam.getGames(appInfo);
  }

  /**
   * Activate free games
   */
  public async requestFreeLicense(appids: number[]): Promise<Game[]> {
    if (!appids.length) return [];

    const res: ClientRequestFreeLicenseRes = await this.steam.sendProtoPromise(Language.EMsg.ClientRequestFreeLicense, {
      appids,
    });

    if (res.eresult !== Language.EResult.OK) {
      throw new SteamClientError(Language.EResultMap.get(res.eresult));
    }

    if (!res.grantedAppids || !res.grantedAppids.length) return [];

    const appsInfo = await this.steam.getAppsInfo(res.grantedAppids);
    return this.steam.getGames(appsInfo);
  }
}
