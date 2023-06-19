import Connection from "./Connection.js";
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Player from "./services/Player.js";
import Econ from "./services/Econ.js";
import Client from "./Client.js";
import { Language } from "./resources.js";
import { AccountAuth, AccountData, LoginOptions, LoginOptionsExtended } from "../@types/steam.js";
import { ConnectionOptions } from "../@types/connection.js";
import {
  ClientAccountInfo,
  ClientEmailAddrInfo,
  ClientIsLimitedAccount,
  ClientLogonResponse,
} from "../@types/protoResponse.js";

import { SteamClientError } from "./common.js";
import EResult from "./language/EResult.js";
import Long from "long";
export { SteamClientError, EResult };

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
  public personaName: string;

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

    this.once("ClientLoggedOff", (body) => {
      this.disconnect();
      this.emit("accountLoggedOff", Language.EResultMap.get(body.eresult));
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

    this.once("ClientAccountInfo", async (body: ClientAccountInfo) => {
      this.personaName = body.personaName;
      accountData.personaState = await this.client.setPersonaState("Online");
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
        resolve({ auth: accountAuth, data: { ...accountData, playingState: this.client.playingSessionState } });
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
   * returns account's steamId
   */
  public get steamId(): Long {
    return this.steamid;
  }

  private createMachineName(): string {
    const name = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 5)
      .toUpperCase();
    return "DESKTOP-" + name + "-IDLE";
  }
}
