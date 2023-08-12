import Base from "./Base.js";
import { ConnectionOptions } from "../../@types/connection.js";
import { SteamClientError } from "../common.js";

declare class WebSocketConnection extends Base {
    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
}

export default WebSocketConnection;