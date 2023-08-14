/**
 * Low-level Steam functionality
 */

import Auth from "./services/Auth.js";
import Credentials from "./services/Credentials.js";
import Player from "./services/Player.js";
import Econ from "./services/Econ.js";
import { Language } from "./resources.js";
import { SteamClientError } from "./common.js";
import Long from "long";
import { EResult } from "./language/EResult.js";
import TCPConnection from "./connections/TCPConn.js";
import EventEmitter from "events";
import WebSocketConnection from "./connections/WebsocketConn.js";
import { ConnectionOptions } from "../@types/connections/Base.js";

export { SteamClientError, EResult };

export default abstract class Steam extends EventEmitter {
  public readonly service: {
    auth: Auth;
    credentials: Credentials;
    player: Player;
    econ: Econ;
  };

  public readonly machineName: string;
  protected loggedIn = false;
  protected personaName: string;
  public readonly conn: WebSocketConnection | TCPConnection


  constructor(options: ConnectionOptions) {
    super();

    // create connection
    if (options.type === "ws") {
      this.conn = new WebSocketConnection(options);
    } else if (options.type === "tcp") {
      this.conn = new TCPConnection(options);
    }

    // inject dependencies
    this.service = {
      auth: new Auth(this),
      credentials: new Credentials(this),
      player: new Player(this),
      econ: new Econ(this),
    };

    // create machine name
    this.machineName = this.createMachineName();

    this.conn.once("ClientLoggedOff", (body) => {
      this.disconnect();
      this.emit("ClientLoggedOff", Language.EResultMap.get(body.eresult));
    });
  }

  public disconnect() {
    this.conn.destroyConnection();
  }

  public get isLoggedIn() {
    return this.conn.isLoggedIn();
  }

  public get steamId(): Long {
    return this.conn.steamid;
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
