/**
 * Handle websocket connection to steam
 */
import WebSocket from "ws";
import Base from "./Base.js";
import { SteamClientError } from "../modules/common.js";
import { SocksProxyAgent } from "socks-proxy-agent";
import { ConnectionOptions } from "../../@types/connections/Base.js";
import { EMsg } from "../language/enums_clientserver.js";

export default class WebSocketConnection extends Base {
  private ws!: WebSocket;

  constructor(protected options: ConnectionOptions) {
    super(options);

    // send data to Steam
    this.on("sendData", (message: Buffer) => this.ws.send(message));
  }

  public async connect(): Promise<void> {
    // set proxy agent if proxy was specified
    const wsOptions = {
      agent: this.options.proxy ? new SocksProxyAgent(`socks://username:password@${this.options.proxy.host}:${this.options.proxy.port}`) : undefined,
    };

    const wsURL = "wss://" + `${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`;
    this.ws = new WebSocket(wsURL, { ...wsOptions });

    // received data from steam
    this.ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        return this.destroyConnection(new SteamClientError("Data received was not binary."));
      }
      this.decodeData(data as Buffer);
    });

    this.ws.once("close", (code) => {
      if (!this.isLoggedIn()) return;
      // not normal close
      if (code !== 1000) {
        this.destroyConnection(new SteamClientError(code.toString()));
      }
    });

    this.ws.on("error", (error) => {
      if (!this.isLoggedIn()) return;
      this.destroyConnection(new SteamClientError(error.message));
    });

    return new Promise((resolve, reject) => {
      // expect connection handshake before timeout
      const timeoutId = setTimeout(() => {
        this.destroyConnection();
        reject(new SteamClientError("Connecting to Steam timeout."));
      }, this.timeout);

      const errorListener = (error: Error) => {
        clearTimeout(timeoutId);
        this.destroyConnection();
        reject(new SteamClientError(error.message));
      };
      this.ws.once("error", errorListener);

      // connected
      this.ws.once("open", () => {
        clearTimeout(timeoutId);
        this.ws.removeListener("error", errorListener);
        this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });
        resolve();
      });
    });
  }

  public destroyConnection(error?: SteamClientError) {
    super.destroyConnection(error);
    if (this.ws) {
      this.removeAllListeners();
      this.ws.terminate();
      this.ws.removeAllListeners();
    }
  }
}
