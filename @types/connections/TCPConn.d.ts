import type { ConnectionOptions } from "../../@types/connection.js";
import type { SteamClientError } from "../common.js";
import type Base from "./Base.js";

declare class TCPConnection extends Base {
  readonly timeout: number;
  constructor(protected options: ConnectionOptions);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
  destroyConnection(error?: SteamClientError): void;
}

export default TCPConnection;
