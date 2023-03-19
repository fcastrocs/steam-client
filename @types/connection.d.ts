/**
 * Handle low-level connection to steam.
 */
import { EventEmitter } from "events";
import Long from "long";
import { SocksClientOptions } from "socks";
import SteamClientError from "SteamClientError";

export type PromiseResolve = (value: T) => void;

export type JobidTargets = Map<number, Long>;
export type JobidSources = Map<string, UnifiedMessage>;
export type ProtoResponses = Map<string, PromiseResolve>;

export interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
}

export interface Session {
  clientId: number;
  key: SessionKey;
  steamId: Long;
}

export interface UnifiedMessage {
  method: string;
  jobidSource: Long;
  targetJobName: string;
  resolve: PromiseResolve;
}

export interface Proto {
  EMsg: number;
  payload: Record<string, T> | Buffer;
  unified?: { jobId: Long };
}

export interface ConnectionOptions {
  steamCM: SocksClientOptions["destination"];
  proxy?: SocksClientOptions["proxy"];
  timeout?: number;
}

declare abstract class Connection extends EventEmitter {
  readonly timeout: number;
  constructor(options: ConnectionOptions);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
  /**
   * Use this for proto messages that have a response from Steam
   */
  sendProtoPromise(EMsg: number, payload: T, resEMsg?: number): Promise<T>;
  /**
   * Use this for proto messages that don't have a response from Steam
   */
  sendProto(EMsg: number, payload: T): void;
  /**
   * use this for steammessages_unified or service proto messages
   */
  sendUnified(serviceName: string, method: string, payload: T): Promise<T>;

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
}

export default Connection;
