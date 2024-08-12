/* eslint-disable no-bitwise */
/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 *       'sendData' to catch in connection protocal subclass
 */

import { EventEmitter } from 'events';
import { SmartBuffer } from 'smart-buffer';
import Long from 'long';
import { UnknownRecord, ValueOf } from 'type-fest';
import { gunzipSync } from 'zlib';
import SteamProtos from '../modules/SteamProtos.js';
import Language from '../modules/language.js';
import { SteamClientError } from '../modules/common.js';
import type {
    CMsgClientLogOnResponse,
    CMsgMulti,
    CMsgProtoBufHeader,
    ConnectionOptions,
    ServiceMethodCall
} from '../../@types/index.js';

const { EMsgMap, EMsg } = Language;

export default abstract class Base extends EventEmitter {
    protected establishedConn: boolean;

    private heartBeat: NodeJS.Timeout;

    protected readonly MAGIC = 'VT01';

    protected readonly PROTO_MASK = 0x80000000;

    private JOB_NONE = Long.fromString('18446744073709551615', true);

    private jobIdTimeout = 3 * 60 * 1000;

    private connectionDestroyed = false;

    private readonly serviceMethodCalls: Map<string, ServiceMethodCall> = new Map();

    private readonly jobidTargets: Map<ValueOf<typeof EMsg>, Long> = new Map();

    private readonly protoResponses: Map<ValueOf<typeof EMsg>, (value: UnknownRecord) => void> = new Map();

    public readonly timeout: number = 10000;

    private DEFAULT_STEAMID = Long.fromString('76561197960265728', true);

    private session = {
        clientId: 0,
        steamId: this.DEFAULT_STEAMID
    };

    private steamProtos = new SteamProtos();

    constructor(protected options: ConnectionOptions) {
        super();
        // set timeout only if greater than current value
        this.timeout = options.timeout && options.timeout > this.timeout ? options.timeout : this.timeout;
    }

    public async initialize() {
        await this.steamProtos.loadProtos();
    }

    /**
     * Send proto message
     */
    public sendProto(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord) {
        if (!this.isConnected()) throw new SteamClientError('Client is not connected to Steam.');

        const protoHeader = this.buildProtoHeader(eMsg);
        const body = this.steamProtos.encode(`CMsg${EMsgMap.get(eMsg)}`, payload);
        this.emit('sendData', Buffer.concat([protoHeader, body]));
    }

    /**
     * Send proto message and wait for response
     */
    public sendProtoPromise(
        eMsg: ValueOf<typeof EMsg>,
        payload: UnknownRecord,
        resEMsg: ValueOf<typeof EMsg>
    ): Promise<UnknownRecord> {
        if (!this.isConnected()) throw new SteamClientError('Client is not connected to Steam.');

        return new Promise((resolve) => {
            this.protoResponses.set(resEMsg, resolve);
            this.sendProto(eMsg, payload);
        });
    }

    /**
     * Send service method call
     */
    public sendServiceMethodCall(serviceName: string, method: string, body: UnknownRecord): Promise<UnknownRecord> {
        if (!this.isConnected()) throw new SteamClientError('Client is not connected to Steam.');

        let targetJobName = `${serviceName}.${method}#1`;
        targetJobName = targetJobName.replace('AccessToken_GenerateForApp', 'GenerateAccessTokenForApp');

        const newMethod = `C${serviceName}_${method}`;

        const jobidSource = Long.fromInt(Math.floor(Date.now() + Math.random()), true);

        return new Promise((resolve) => {
            const serviceMethodCall: ServiceMethodCall = {
                method: newMethod,
                promiseResolve: resolve,
                targetJobName,
                jobidSource
            };

            // save jobId that steam will send a response to
            this.serviceMethodCalls.set(jobidSource.toString(), serviceMethodCall);

            // steam has this.jobIdTimeout ms to response to this jobId
            setTimeout(() => this.serviceMethodCalls.delete(jobidSource.toString()), this.jobIdTimeout);

            const serviceMethodEMsg = this.session.steamId.equals(this.DEFAULT_STEAMID)
                ? EMsg.ServiceMethodCallFromClientNonAuthed
                : EMsg.ServiceMethodCallFromClient;

            const protoHeader = this.buildProtoHeader(serviceMethodEMsg, serviceMethodCall);
            const buffer = this.steamProtos.encode(`${newMethod}_Request`, body);
            this.emit('sendData', Buffer.concat([protoHeader, buffer]));
        });
    }

    public isLoggedIn() {
        return !!this.session && this.session.steamId !== this.DEFAULT_STEAMID && this.session.clientId !== 0;
    }

    public get steamid() {
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
        if (!this.isConnected()) return;

        const packet = SmartBuffer.fromBuffer(data);

        const rawEMsg = packet.readUInt32LE();
        const EMsgReceived = rawEMsg & ~this.PROTO_MASK;
        const isProto = rawEMsg & this.PROTO_MASK;
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
        if (proto.jobidSource && !this.JOB_NONE.equals(proto.jobidSource)) {
            const key = `${EMsgReceivedKey}Response` as keyof typeof EMsg;
            this.jobidTargets.set(EMsg[key], proto.jobidSource);
            // we have this.jobIdTimeout ms to response to this jobId
            setTimeout(() => this.jobidTargets.delete(EMsg[key]), this.jobIdTimeout);
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

            // console.debug(`EMsg: ${eMsg.key}`);

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
     * Destroy connection to Steam and do some cleanup
     * disconnected is emmitted when error is passed
     */
    protected destroyConnection(error?: SteamClientError) {
        // make sure method is called only once
        if (this.connectionDestroyed) return;

        this.connectionDestroyed = true;
        this.session = null;

        // emmit if disconnect happened because of an error
        if (error) this.emit('disconnected', error);

        clearInterval(this.heartBeat);
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
        sBuffer.writeInt32LE(eMsg | this.PROTO_MASK);

        // CMsgProtoBufHeader
        const message: CMsgProtoBufHeader = {
            steamid: this.session.steamId,
            clientSessionid: this.session.clientId,
            jobidTarget: this.jobidTargets.get(eMsg) || this.JOB_NONE,
            targetJobName: serviceMethodCall?.targetJobName,
            jobidSource: serviceMethodCall?.jobidSource || this.JOB_NONE
        };

        // steam will receive response to this jobId
        this.jobidTargets.delete(eMsg);

        const cMsgProtoBufHeader = this.steamProtos.encode('CMsgProtoBufHeader', message);
        sBuffer.writeInt32LE(cMsgProtoBufHeader.length);
        sBuffer.writeBuffer(cMsgProtoBufHeader);

        return sBuffer.toBuffer();
    }

    private multi(payload: Buffer) {
        const message: CMsgMulti = this.steamProtos.decode('CMsgMulti', payload);
        let body = message.messageBody;

        // message is gzipped
        if (message.sizeUnzipped) {
            body = gunzipSync(body);
        }

        while (body.length) {
            const subSize = body.readUInt32LE(0);
            this.decodeData(body.subarray(4, 4 + subSize));
            body = body.subarray(4 + subSize);
        }
    }

    protected isConnected() {
        return !this.connectionDestroyed && this.establishedConn;
    }
}
