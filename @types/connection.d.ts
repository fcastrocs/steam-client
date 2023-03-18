/**
 * Handle low-level connection to steam.
 */
import { EventEmitter } from "events";
import Long from "long";
import { SocksClientOptions } from "socks";
import SteamClientError from "SteamClientError";

type PromiseResolve = (value: T) => void;

type JobidTargets = Map<number, Long>;
type JobidSources = Map<string, UnifiedMessage>;
type ProtoResponses = Map<string, PromiseResolve>;

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
  jobidSource: Long;
  targetJobName: string;
  resolve: PromiseResolve;
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

export default abstract class Connection extends EventEmitter {
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  private guardType: number;
  readonly timeout: number;
  constructor(options: ConnectionOptions);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;

  protected get steamid(): Long;

  /**
   * Destroy connection to Steam and do some cleanup
   * disconnected is emmitted when error is passed
   */
  protected destroyConnection(error?: SteamClientError): void;
  /**
   * Heartbeat connection after login
   */
  protected startHeartBeat(beatTimeSecs: number): void;
  sendProtoPromise(EMsg: number, payload: T, resEMsg?: number): Promise<T>;
  sendProto(EMsg: number, payload: T): void;
  sendUnified(serviceName: string, method: string, payload: T): Promise<T>;
}
