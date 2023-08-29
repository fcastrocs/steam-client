import type { EventEmitter } from "events";
import type Long from "long";
import type { SteamClientError, T } from "../common.js";
import type { EventEmitter } from "events";
import type Long from "long";
import type { SocksClientOptions } from "socks";
import type { EMsg } from "../enums/enums_clientserver.proto.js";
import type { ValueOf } from "type-fest";

export interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
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
  protected readonly MAGIC = "VT01";
  protected readonly PROTO_MASK = 2147483648;
  protected readonly timeout: number;
  constructor(protected options: ConnectionOptions);
  /**
   * Send proto message
   */
  sendProto(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord): void;
  /**
   * Send proto message and wait for response
   */
  sendProtoPromise(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord, resEMsg: ValueOf<typeof EMsg>): Promise<UnknownRecord>;
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
  protected decodeData(data: Buffer): void;
  /**
   * Destroy connection to Steam and do some cleanup
   * disconnected is emmitted when error is passed
   */
  protected destroyConnection(error?: SteamClientError): void;
}

export default Base;
