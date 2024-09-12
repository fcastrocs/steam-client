/* eslint-disable no-bitwise */
/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 */

import { SmartBuffer } from 'smart-buffer';
import Long from 'long';
import { UnknownRecord, ValueOf } from 'type-fest';
import { gunzip } from 'zlib';
import { promisify } from 'util';
import EventEmitter from 'events';
import SteamProtos from '../modules/SteamProtos.js';
import Language from '../modules/language.js';
import type {
    CMsgClientLogOnResponse,
    CMsgMulti,
    CMsgProtoBufHeader,
    ServiceMethodCall,
    SteamConnectionOptions
} from '../../@types/index.js';
import SteamWebSocket from './SteamWs.js';
import SteamTcp from './SteamTcp.js';

const gunzipAsync = promisify(gunzip);

const { EMsgMap, EMsg } = Language;
const DEFAULT_STEAMID = Long.fromString('76561197960265728', true);
const JOB_NONE = Long.fromString('18446744073709551615', true);
const PROTO_MASK = 0x80000000;

export default abstract class Connection {
    private heartBeat: NodeJS.Timeout;

    private readonly serviceMethodCalls: Map<string, ServiceMethodCall> = new Map();

    private readonly jobidTargets: Map<ValueOf<typeof EMsg>, Long> = new Map();

    private readonly protoResponses: Map<ValueOf<typeof EMsg>, (value: UnknownRecord) => void> = new Map();

    private readonly steamProtos = new SteamProtos();

    private timeouts: NodeJS.Timeout[] = [];

    private connection: SteamWebSocket | SteamTcp;

    private readonly emitter = new EventEmitter();

    private session = {
        clientId: 0,
        steamId: DEFAULT_STEAMID
    };

    protected options: SteamConnectionOptions;

    constructor() {
        this.on('disconnected', () => {
            this.resetState();
        });
    }

    async connect(options: SteamConnectionOptions) {
        this.options = options;
        await this.steamProtos.loadProtos(options.cachedProtos);

        if (!this.options.protocal || this.options.protocal === 'ws') {
            this.connection = new SteamWebSocket(this.emitter);
        } else {
            this.connection = new SteamTcp(this.emitter);
        }

        await this.connection.connect(options);

        this.sendProto(EMsg.ClientHello, { protocolVersion: 65580 });

        this.connection.socket.on('data', (data) => {
            const payload = this.connection.getPayloadFromFrame(data);
            if (payload) {
                this.decodeData(payload);
            }
        });
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }

    private resetState() {
        this.connection = null;
        this.session.clientId = 0;
        this.session.steamId = DEFAULT_STEAMID;
        clearInterval(this.heartBeat);
        this.serviceMethodCalls.clear();
        this.jobidTargets.clear();
        this.protoResponses.clear();
        this.timeouts.forEach((timeout) => clearTimeout(timeout));
        this.timeouts = [];
    }

    public getCachedProtos() {
        return this.steamProtos.loadProtos();
    }

    /**
     * Send proto message
     */
    public sendProto(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord) {
        const protoHeader = this.buildProtoHeader(eMsg);
        const body = this.steamProtos.encode(`CMsg${EMsgMap.get(eMsg)}`, payload);
        this.connection.send(Buffer.concat([protoHeader, body]));
    }

    /**
     * Send proto message and wait for response
     */
    public sendProtoPromise(
        eMsg: ValueOf<typeof EMsg>,
        payload: UnknownRecord,
        resEMsg: ValueOf<typeof EMsg>
    ): Promise<UnknownRecord> {
        return new Promise((resolve) => {
            this.protoResponses.set(resEMsg, resolve);
            this.sendProto(eMsg, payload);
        });
    }

    /**
     * Send service method call
     */
    public sendServiceMethodCall(serviceName: string, method: string, body: UnknownRecord): Promise<UnknownRecord> {
        let targetJobName = `${serviceName}.${method}#1`;
        targetJobName = targetJobName.replace('AccessToken_GenerateForApp', 'GenerateAccessTokenForApp');

        const newMethod = `C${serviceName}_${method}`;

        const jobidSource = Long.fromInt(Math.floor(Date.now() + Math.random()), true);

        return new Promise((resolve, reject) => {
            // Timeout if steam doesn't respond
            const timeout = setTimeout(() => {
                this.serviceMethodCalls.delete(jobidSource.toString());
                reject(new Error('ServiceMethodCall Response timeout.'));
            }, this.options.timeout);

            this.timeouts.push(timeout);

            const serviceMethodCall: ServiceMethodCall = {
                method: newMethod,
                promiseResolve: resolve,
                targetJobName,
                jobidSource,
                timeout
            };

            // save jobId that steam will send a response to
            this.serviceMethodCalls.set(jobidSource.toString(), serviceMethodCall);

            const serviceMethodEMsg = this.session.steamId.equals(DEFAULT_STEAMID)
                ? EMsg.ServiceMethodCallFromClientNonAuthed
                : EMsg.ServiceMethodCallFromClient;

            const protoHeader = this.buildProtoHeader(serviceMethodEMsg, serviceMethodCall);
            const buffer = this.steamProtos.encode(`${newMethod}_Request`, body);

            this.connection.send(Buffer.concat([protoHeader, buffer]));
        });
    }

    public get isLoggedIn() {
        return (
            this.connection &&
            this.connection.connected &&
            this.session.steamId !== DEFAULT_STEAMID &&
            this.session.clientId !== 0
        );
    }

    public get steamId() {
        return this.session.steamId;
    }

    public setSteamId(steamId: string) {
        this.session.steamId = Long.fromString(steamId, true);
    }

    /**
     * Decode data and emmit decoded payload.
     * Steam sends ProtoBuf or NonProtoBuf
     * ProtoBuf: [ header: [EMsg, header length, CMsgProtoBufHeader], body: proto] ]
     * NonProtoBuf: [ header: [EMsg, header length, ExtendedHeader], body: raw bytes] ]
     */
    protected decodeData(data: Buffer): void {
        const packet = SmartBuffer.fromBuffer(data);

        const rawEMsg = packet.readUInt32LE();
        const EMsgReceived = rawEMsg & ~PROTO_MASK;
        const isProto = rawEMsg & PROTO_MASK;
        const EMsgReceivedKey = EMsgMap.get(EMsgReceived);

        // package is gzipped, have to gunzip it first
        if (EMsgReceived === EMsg.Multi) {
            this.multi(packet.readBuffer());
            return;
        }

        if (!isProto) {
            // Extended header
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const headerSize = packet.readUInt8();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const headerVersion = packet.readUInt16LE();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const targetJobId = packet.readBigUInt64LE();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const sourceJobId = packet.readBigUInt64LE();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const canaray = packet.readUInt8();
            const steamId = Long.fromString(packet.readBigUInt64LE().toString(), true);
            this.session.steamId = !steamId.equals(Long.UZERO) ? steamId : this.session.steamId;
            this.session.clientId = packet.readInt32LE();

            if (EMsgReceived === EMsg.ClientVACBanStatus) {
                this.emit('ClientVACBanStatus', {
                    numBans: packet.readUInt32LE()
                });
            }

            return;
        }

        const headerLength = packet.readUInt32LE();
        const proto: CMsgProtoBufHeader = this.steamProtos.decode('CMsgProtoBufHeader', packet.readBuffer(headerLength));
        this.session.steamId = proto.steamid;
        this.session.clientId = proto.clientSessionid;

        // steam expects a response to this jobId
        if (proto.jobidSource && !JOB_NONE.equals(proto.jobidSource)) {
            const key = `${EMsgReceivedKey}Response` as keyof typeof EMsg;
            this.jobidTargets.set(EMsg[key], proto.jobidSource);
            // we have this.jobIdTimeout ms to response to this jobId
            setTimeout(() => this.jobidTargets.delete(EMsg[key]), this.options.timeout);
        }

        // service method
        if (EMsgReceived === EMsg.ServiceMethodResponse) {
            const serviceMethodCall = this.serviceMethodCalls.get(proto.jobidTarget.toString());
            const message = this.steamProtos.decode(`${serviceMethodCall?.method}_Response`, packet.readBuffer());
            this.serviceMethodCalls.delete(proto.jobidTarget.toString());
            serviceMethodCall?.promiseResolve({
                EResult: proto.eresult,
                ...message
            });
            clearTimeout(serviceMethodCall.timeout);
            return;
        }

        if (EMsgReceived === EMsg.ServiceMethod) {
            // console.debug(`unhandled service method: ${proto.targetJobName}`);
            return;
        }

        // assign correct EMsg key and value
        const eMsg = { key: EMsgReceivedKey, value: EMsgReceived };
        if (EMsgReceived === EMsg.ClientGamesPlayedNoDataBlob || EMsgReceived === EMsg.ClientGamesPlayedWithDataBlob) {
            eMsg.value = EMsg.ClientGamesPlayed;
        }
        eMsg.key = EMsgMap.get(eMsg.value);

        // decode body and emit message
        try {
            const body = this.steamProtos.decode(`CMsg${eMsg.key}`, packet.readBuffer());
            // emit message
            this.emit(eMsg.key, body);

            // response to sendProtoPromise
            const promiseResolve = this.protoResponses.get(eMsg.value);
            if (promiseResolve) {
                this.protoResponses.delete(eMsg.value);
                promiseResolve(body);
            }

            // start heartbeat if logged in successfully
            if (eMsg.value === EMsg.ClientLogOnResponse) {
                const res: CMsgClientLogOnResponse = body;
                if (res.eresult === 1) {
                    this.startHeartBeat(res.heartbeatSeconds);
                }
            }
        } catch (error) {
            // console.error(`Proto decode failed: ${eMsg.key}`);
        }
    }

    /**
     * Heartbeat connection after login
     */
    private startHeartBeat(beatTimeSecs: number) {
        this.heartBeat = setInterval(() => {
            this.sendProto(EMsg.ClientHeartBeat, {});
        }, beatTimeSecs * 1000);
    }

    /**
     * build header: [EMsg, CMsgProtoBufHeader length, CMsgProtoBufHeader]
     */
    private buildProtoHeader(eMsg: ValueOf<typeof EMsg>, serviceMethodCall?: ServiceMethodCall): Buffer {
        const sBuffer = new SmartBuffer();

        // EMsg must be PROTO MASKED
        sBuffer.writeInt32LE(eMsg | PROTO_MASK);

        // CMsgProtoBufHeader
        const message: CMsgProtoBufHeader = {
            steamid: this.session.steamId,
            clientSessionid: this.session.clientId,
            jobidTarget: this.jobidTargets.get(eMsg) || JOB_NONE,
            targetJobName: serviceMethodCall?.targetJobName,
            jobidSource: serviceMethodCall?.jobidSource || JOB_NONE
        };

        // steam will receive response to this jobId
        this.jobidTargets.delete(eMsg);

        const cMsgProtoBufHeader = this.steamProtos.encode('CMsgProtoBufHeader', message);
        sBuffer.writeInt32LE(cMsgProtoBufHeader.length);
        sBuffer.writeBuffer(cMsgProtoBufHeader);

        return sBuffer.toBuffer();
    }

    private async multi(payload: Buffer) {
        const message: CMsgMulti = this.steamProtos.decode('CMsgMulti', payload);
        let body = message.messageBody;

        // message is gzipped
        if (message.sizeUnzipped) {
            body = await gunzipAsync(body);
        }

        while (body.length) {
            const subSize = body.readUInt32LE(0);
            this.decodeData(body.subarray(4, 4 + subSize));
            body = body.subarray(4 + subSize);
        }
    }

    emit(event: string, ...args: any[]) {
        this.emitter.emit(event, ...args);
    }

    removeListeners(eventName: string) {
        this.emitter.removeAllListeners(eventName);
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.emitter.on(event, listener);
    }

    once(event: string, listener: (...args: any[]) => void) {
        this.emitter.once(event, listener);
    }
}
