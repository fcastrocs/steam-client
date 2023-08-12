import { ConnectionOptions } from "../../@types/connection.js";
import { SteamClientError } from "../common.js";
import Base from "./Base.js";

declare class TCPConnection extends Base {
    readonly timeout: number;
    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
}

export default TCPConnection;