import { EventEmitter } from "events";
import Long from "long";
import { SteamClientError, T } from "../common.js";
import { EventEmitter } from "events";
import Long from "long";
import { SocksClientOptions } from "socks";

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
  type: "ws" | "tcp";
  steamCM: SocksClientOptions["destination"];
  proxy?: SocksClientOptions["proxy"];
  timeout?: number;
}

declare abstract class Base extends EventEmitter {
  on(event: "sendData", listener: (data: Buffer) => void): this;
  once(event: "sendData", listener: (data: Buffer) => void): this;
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;
  once(event: "disconnected", listener: (error: SteamClientError) => void): this;

  constructor();
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
  /**
 * Heartbeat connection after login
 */
  startHeartBeat(beatTimeSecs: number): void;
  get steamid(): Long;
}

export default Base;