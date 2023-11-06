import { SteamClientError } from "../index.js";
import Base, { ConnectionOptions } from "./Base.js";

export default class WebSocketConnection extends Base {
    protected options: ConnectionOptions;
    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
}
