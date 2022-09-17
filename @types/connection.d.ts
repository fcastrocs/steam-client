/**
 * Handle low-level connection to steam.
 */
import { EventEmitter } from "events";
import Long from "long";
import SteamClientError from "SteamClientError";

type JobidTargets = Map<number, Long>;
type JobidSources = Map<string, UnifiedMessage>;

interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
}

interface Session {
  clientId: number;
  key: SessionKey;
  steamId: Long;
}

interface UnifiedMessage {
  method: string;
  targetJobName: string;
  resolve: (value: T) => void;
}

interface Proto {
  EMsg: number;
  payload: Record<string, T> | Buffer;
  unified?: { jobId: Long };
}

interface ConnectionOptions {
  steamCM: SocksClientOptions["destination"];
  proxy?: SocksClientOptions["proxy"];
  timeout?: number;
}

export default interface IConnection extends EventEmitter {
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  readonly timeout: number;
  /**
   * Send packet to steam
   * message: Buffer(message.length, MAGIC, proto | channelEncryptResponse)
   */
  public send(message: Proto | Buffer);

  public sendUnified(serviceName: string, method: string, payload: T): Promise<T>;
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
}
