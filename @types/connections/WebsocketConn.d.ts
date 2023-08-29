import type Base from "./Base.js";
import type { ConnectionOptions } from "../../@types/connection.js";
import type { SteamClientError } from "../common.js";

declare class WebSocketConnection extends Base {
  constructor(protected options: ConnectionOptions);
  connect(): Promise<void>;
  destroyConnection(error?: SteamClientError): void;
}

export default WebSocketConnection;
