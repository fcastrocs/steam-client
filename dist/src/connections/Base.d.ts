/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 *       'sendData' to catch in connection protocal subclass
 */
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from "events";
import { EMsg } from "../modules/language.js";
import Long from "long";
import { SteamClientError } from "../modules/common.js";
import { ConnectionOptions } from "../../@types/connections/Base.js";
import { UnknownRecord } from "type-fest";
export default abstract class Base extends EventEmitter {
    protected options: ConnectionOptions;
    private heartBeat;
    protected readonly MAGIC = "VT01";
    protected readonly PROTO_MASK = 2147483648;
    private JOB_NONE;
    private jobIdTimeout;
    private connectionDestroyed;
    private readonly serviceMethodCalls;
    private readonly jobidTargets;
    private readonly protoResponses;
    protected readonly timeout: number;
    private DEFAULT_STEAMID;
    private session;
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
    /**
     * Heartbeat connection after login
     */
    private startHeartBeat;
    /**
     * build header: [EMsg, CMsgProtoBufHeader length, CMsgProtoBufHeader]
     */
    private buildProtoHeader;
    private multi;
}
