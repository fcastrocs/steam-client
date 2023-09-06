/**
 * Handle websocket connection to steam
 */
import Base from "./Base.js";
import { SteamClientError } from "../modules/common.js";
import { ConnectionOptions } from "../../@types/connections/Base.js";
export default class WebSocketConnection extends Base {
    protected options: ConnectionOptions;
    private ws;
    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
}
