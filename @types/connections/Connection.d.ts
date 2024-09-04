/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 */

import Long from 'long';
import { UnknownRecord, ValueOf } from 'type-fest';
import { SteamConnection } from './SteamConnection.js';

declare const EMsg: typeof import('../../resources/language/enums_clientserver.js').EMsg;

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

export abstract class Connection extends SteamConnection {
    connect(): Promise<void>;
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
    get isLoggedIn(): boolean;
    get steamId(): Long;
    setSteamId(steamId: string): void;
    /**
     * Decode data and emmit decoded payload.
     * Steam sends ProtoBuf or NonProtoBuf
     * ProtoBuf: [ header: [EMsg, header length, CMsgProtoBufHeader], body: proto] ]
     * NonProtoBuf: [ header: [EMsg, header length, ExtendedHeader], body: raw bytes] ]
     */
    protected decodeData(data: Buffer): void;
    /**
     * Destroy connection to Steam
     */
    disconnect(): void;
}
