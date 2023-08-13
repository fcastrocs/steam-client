/**
 * Handle websocket connection to steam
 */
import WebSocket from "ws";
import Base from "./Base.js";
import { SteamClientError } from "../common.js";
import { SocksProxyAgent } from "socks-proxy-agent";
import { ConnectionOptions } from "../../@types/connections/Base.js";
import { EMsg } from "../language/enums_clientserver.proto.js";

export default class WebSocketConnection extends Base {
  private ws: WebSocket
  private options: ConnectionOptions;

  constructor(options: ConnectionOptions) {
    super();
    this.options = options;

    // send data to Steam
    this.on("sendData", (message: Buffer) => this.ws.send(message))
  }

  public async connect() {
    // set proxy agent if proxy was specified
    const wsOptions = {
      agent: this.options.proxy ? new SocksProxyAgent(`socks://username:password@${this.options.proxy.host}:${this.options.proxy.port}`) : undefined
    };

    const wsURL = "wss://" + `${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`;
    this.ws = new WebSocket(wsURL, { ...wsOptions });

    // received data from steam
    this.ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        return this.destroyConnection(new SteamClientError("Data received was not binary."))
      }
      this.decodeData(data as Buffer);
    });


    this.ws.once("close", (code) => {
      // not normal close
      if (code !== 1000) {
        this.destroyConnection(new SteamClientError(code.toString()))
      }
    });

    this.ws.on("error", error => {
      if (!this.connected) return;
      this.destroyConnection(new SteamClientError(error.message))
    })

    return new Promise((resolve, reject) => {
      const errorListener = (error: Error) => {
        this.destroyConnection();
        reject(new SteamClientError(error.message));
      }
      this.ws.once("error", errorListener);
      this.ws.once("open", () => {
        this.ws.removeListener("error", errorListener);
        this.connected = true;
        this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });
        resolve("connected");
      });
    })
  }

  public destroyConnection(error?: SteamClientError) {
    super.destroyConnection(error);
    if (this.ws) {
      this.removeAllListeners();
      this.ws.terminate();
      this.ws.removeAllListeners();
      this.ws = null;
    }
  }
}
