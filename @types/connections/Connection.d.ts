/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 */

import Long from 'long';
import { Root } from 'protobufjs';
import { UnknownRecord, ValueOf } from 'type-fest';

declare const EMsg: typeof import('../../resources/language/enums_clientserver.js').EMsg;

export interface Server {
    host: string;
    port: number;
}

export interface Authentication {
    user?: string;
    pass?: string;
}

export interface SteamConnectionOptions {
    steamCM: Server;
    protocol?: 'ws' | 'tcp';
    proxy?: Server & Authentication & { protocol: 'http' | 'socks'; socksVersion?: 4 | 5 };
    timeout: number;
    cachedProtos?: CachedProtos;
}

export interface CachedProtos {
    protosRoot: Root;
    preloadedTypes: Map<string, Type>;
}

export interface ServiceMethodCall {
    method: string;
    jobidSource: Long;
    targetJobName: string;
    promiseResolve: (value: UnknownRecord | PromiseLike<UnknownRecord>) => void;
    timeout: NodeJS.Timeout;
}

export abstract class Connection {
    connect(options: SteamConnectionOptions): Promise<void>;
    disconnect(): void;
    getCachedProtos(): Promise<CachedProtos>;

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

    on(event: string, listener: (...args: any[]) => void): void;
    once(event: string, listener: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
}
