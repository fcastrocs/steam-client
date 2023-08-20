import { EventEmitter } from "events";
import Long from "long";
import { SteamClientError, T } from "../common.js";
import { EventEmitter } from "events";
import Long from "long";
import { SocksClientOptions } from "socks";
import { EMsg } from "../enums/enums_clientserver.proto.js";

export type PromiseResolve = (value: T) => void;
export type JobidTargets = Map<number, Long>;
export type ProtoResponses = Map<keyof EMsg, PromiseResolve>;

export interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
}

export interface Session {
  clientId: number;
  steamId: Long;
}

export interface ServiceMethodCall {
  method: string;
  jobidSource: Long;
  targetJobName: string;
  promiseResolve: PromiseResolve;
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

  protected options: ConnectionOptions;
  protected readonly MAGIC = "VT01";
  protected readonly PROTO_MASK = 2147483648;
  protected readonly timeout: number;

  constructor(protected options: ConnectionOptions);
  /**
   * Send proto message
   */
  sendProto(EMsg: number, payload: UnknownRecord): void;
  /**
   * Send proto message and wait for response
   */
  sendProtoPromise(EMsg: number, payload: UnknownRecord, resEMsg?: number): Promise<UnknownRecord>;
  /**
   * Send service method call
   */
  sendServiceMethodCall(serviceName: string, method: string, body: UnknownRecord): Promise<UnknownRecord>;
  isLoggedIn(): boolean;
  get steamid(): Long;
  setSteamId(steamId: string): void;
  /**
   * Decode data and emmit decoded payload.
   * Steam sends ProtoBuf or NonProtoBuf
   * ProtoBuf: [ header: [EMsg, header length, CMsgProtoBufHeader], body: proto] ]
   * NonProtoBuf: [ header: [EMsg, header length, ExtendedHeader], body: raw bytes] ]
   */
  protected decodeData(data: Buffer): void | Promise<void>;
  /**
   * Destroy connection to Steam and do some cleanup
   * disconnected is emmitted when error is passed
   */
  protected destroyConnection(error?: SteamClientError): void;
}

export default Base;