import { EventEmitter } from "events";
import Long from "long";
import { SocksClientOptions } from "socks";
import { UnknownRecord } from "type-fest";
import { EMsg } from "../../language/enums_clientserver.ts";
import { SteamClientError } from "../index.js";

export interface SessionKey {
    plain: Buffer;
    encrypted: Buffer;
}

export interface ServiceMethodCall {
    method: string;
    jobidSource: Long;
    targetJobName: string;
    promiseResolve: (value: UnknownRecord | PromiseLike<UnknownRecord>) => void;
}

export interface ConnectionOptions {
    type: "ws" | "tcp";
    steamCM: SocksClientOptions["destination"];
    proxy?: SocksClientOptions["proxy"];
    timeout?: number;
}

declare abstract class Base extends EventEmitter {
    protected options: ConnectionOptions;
    protected readonly MAGIC = "VT01";
    protected readonly PROTO_MASK = 2147483648;
    protected readonly timeout: number;
    constructor(options: ConnectionOptions);
    /**
     * Send proto message
     */
    sendProto(eMsg: EMsg, payload: UnknownRecord): void;
    /**
     * Send proto message and wait for response
     */
    sendProtoPromise(eMsg: EMsg, payload: UnknownRecord, resEMsg: EMsg): Promise<UnknownRecord>;
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
