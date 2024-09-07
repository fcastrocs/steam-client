/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 */

import Long from 'long';
import { UnknownRecord, ValueOf } from 'type-fest';
import { Root } from 'protobufjs';
import { SteamConnection, SteamConnectionOptions } from './SteamConnection.js';

declare const EMsg: typeof import('../../resources/language/enums_clientserver.js').EMsg;

export interface ServiceMethodCall {
    method: string;
    jobidSource: Long;
    targetJobName: string;
    promiseResolve: (value: UnknownRecord | PromiseLike<UnknownRecord>) => void;
    timeout: NodeJS.Timeout;
}

export abstract class Connection extends SteamConnection {
    connect(options: SteamConnectionOptions): Promise<void>;
    loadProtos(protos?: Root): Promise<Root>;

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
}
