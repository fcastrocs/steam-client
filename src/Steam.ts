/**
 * Low-level Steam functionality
 */

import Connection from "./Connection.js";
import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Player from "./services/Player.js";
import Econ from "./services/Econ.js";
import { Language } from "./resources.js";
import { ConnectionOptions } from "../@types/connection.js";
import { SteamClientError } from "./common.js";
import Long from "long";
import { EResult } from "./language/EResult.js";

export { SteamClientError, EResult };

export default abstract class Steam extends Connection {
  public readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };

  public readonly machineName: string;
  protected loggedIn = false;
  protected personaName: string;

  constructor(options: ConnectionOptions) {
    super(options);

    // inject dependencies
    this.service = {
      auth: new Auth(this),
      credentials: new Credentials(this),
      player: new Player(this),
      econ: new Econ(this),
    };

    // create machine name
    this.machineName = this.createMachineName();

    this.once("ClientLoggedOff", (body) => {
      this.disconnect();
      this.emit("accountLoggedOff", Language.EResultMap.get(body.eresult));
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
