/**
 * Handle websocket connection to steam
 */
import Base from "./Base.js";
import WebSocket from "ws";
import { SteamClientError } from "../modules/common.js";
import { SocksProxyAgent } from "socks-proxy-agent";
import { EMsg } from "../modules/language.js";
export default class WebSocketConnection extends Base {
    constructor(options) {
        super(options);
        this.options = options;
        // send data to Steam
        this.on("sendData", (message) => this.ws.send(message));
    }
    async connect() {
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
            this.decodeData(data);
        });
        this.ws.once("close", (code) => {
            if (!this.isLoggedIn())
                return;
            // not normal close
            if (code !== 1000) {
                this.destroyConnection(new SteamClientError(code.toString()));
            }
        });
        this.ws.on("error", (error) => {
            if (!this.isLoggedIn())
                return;
            this.destroyConnection(new SteamClientError(error.message));
        });
        return new Promise((resolve, reject) => {
            // expect connection handshake before timeout
            const timeoutId = setTimeout(() => {
                this.destroyConnection();
                reject(new SteamClientError("Connecting to Steam timeout."));
            }, this.timeout);
            const errorListener = (error) => {
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
    destroyConnection(error) {
        super.destroyConnection(error);
        if (this.ws) {
            this.removeAllListeners();
            this.ws.terminate();
            this.ws.removeAllListeners();
        }
    }
}
