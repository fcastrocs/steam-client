import { EventEmitter } from 'events';
import Long from 'long';
import { UnknownRecord, ValueOf } from 'type-fest';
import { SteamClientError } from '../modules/common.js';

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

export interface ConnectionOptions {
    type: 'ws' | 'tcp';
    steamCM: {
        host: string;
        port: number;
    };
    proxy?: {
        type: 'socks' | 'https';
        host: string;
        port: number;
        socksType?: 4 | 5;
        user?: string;
        pass?: string;
    };
    timeout?: number;
}

export default abstract class Base extends EventEmitter {
    protected options: ConnectionOptions;

    private heartBeat;

    protected readonly MAGIC = 'VT01';

    protected readonly PROTO_MASK = 2147483648;

    private JOB_NONE;

    private jobIdTimeout;

    private connectionDestroyed;

    private readonly serviceMethodCalls;

    private readonly jobidTargets;

    private readonly protoResponses;

    readonly timeout: number;

    private DEFAULT_STEAMID;

    private session;

    constructor(options: ConnectionOptions);
    /**
     * Send proto message
     */
    sendProto(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord): void;
    /**
     * Send proto message and wait for response
     */
    sendProtoPromise(
        eMsg: ValueOf<typeof EMsg>,
        payload: UnknownRecord,
        resEMsg: ValueOf<typeof EMsg>
    ): Promise<UnknownRecord>;
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

    private isConnected;
}
