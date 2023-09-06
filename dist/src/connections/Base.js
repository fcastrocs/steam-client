/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 *       'sendData' to catch in connection protocal subclass
 */
import { EventEmitter } from "events";
import { SmartBuffer } from "smart-buffer";
import Zip from "zlib";
import { EMsgMap, EMsg } from "../modules/language.js";
import * as Protos from "../modules/protos.js";
import Long from "long";
import { SteamClientError } from "../modules/common.js";
export default class Base extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.MAGIC = "VT01";
        this.PROTO_MASK = 0x80000000;
        this.JOB_NONE = Long.fromString("18446744073709551615", true);
        this.jobIdTimeout = 3 * 60 * 1000;
        this.connectionDestroyed = false;
        this.serviceMethodCalls = new Map();
        this.jobidTargets = new Map();
        this.protoResponses = new Map();
        this.timeout = 10000;
        this.DEFAULT_STEAMID = Long.fromString("76561197960265728", true);
        this.session = {
            clientId: 0,
            steamId: this.DEFAULT_STEAMID,
        };
        // set timeout only if greater than current value
        this.timeout = options.timeout && options.timeout > this.timeout ? options.timeout : this.timeout;
    }
    /**
     * Send proto message
     */
    sendProto(eMsg, payload) {
        const protoHeader = this.buildProtoHeader(eMsg);
        const body = Protos.encode(`CMsg${EMsgMap.get(eMsg)}`, payload);
        this.emit("sendData", Buffer.concat([protoHeader, body]));
    }
    /**
     * Send proto message and wait for response
     */
    sendProtoPromise(eMsg, payload, resEMsg) {
        return new Promise((resolve) => {
            this.protoResponses.set(resEMsg, resolve);
            this.sendProto(eMsg, payload);
        });
    }
    /**
     * Send service method call
     */
    sendServiceMethodCall(serviceName, method, body) {
        let targetJobName = `${serviceName}.${method}#1`;
        targetJobName = targetJobName.replace("AccessToken_GenerateForApp", "GenerateAccessTokenForApp");
        method = `C${serviceName}_${method}`;
        const jobidSource = Long.fromInt(Math.floor(Date.now() + Math.random()), true);
        return new Promise((resolve) => {
            const serviceMethodCall = {
                method,
                promiseResolve: resolve,
                targetJobName,
                jobidSource,
            };
            // save jobId that steam will send a response to
            this.serviceMethodCalls.set(jobidSource.toString(), serviceMethodCall);
            // steam has this.jobIdTimeout ms to response to this jobId
            setTimeout(() => this.serviceMethodCalls.delete(jobidSource.toString()), this.jobIdTimeout);
            const serviceMethodEMsg = this.session.steamId.equals(this.DEFAULT_STEAMID) ? EMsg.ServiceMethodCallFromClientNonAuthed : EMsg.ServiceMethodCallFromClient;
            const protoHeader = this.buildProtoHeader(serviceMethodEMsg, serviceMethodCall);
            const buffer = Protos.encode(method + "_Request", body);
            this.emit("sendData", Buffer.concat([protoHeader, buffer]));
        });
    }
    isLoggedIn() {
        return !!this.session && this.session.steamId !== this.DEFAULT_STEAMID && this.session.clientId !== 0;
    }
    get steamid() {
        return this.session.steamId;
    }
    setSteamId(steamId) {
        this.session.steamId = Long.fromString(steamId, true);
    }
    /**
     * Decode data and emmit decoded payload.
     * Steam sends ProtoBuf or NonProtoBuf
     * ProtoBuf: [ header: [EMsg, header length, CMsgProtoBufHeader], body: proto] ]
     * NonProtoBuf: [ header: [EMsg, header length, ExtendedHeader], body: raw bytes] ]
     */
    decodeData(data) {
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
                this.emit("ClientVACBanStatus", { numBans: packet.readUInt32LE() });
            }
            return;
        }
        const headerLength = packet.readUInt32LE();
        const proto = Protos.decode("CMsgProtoBufHeader", packet.readBuffer(headerLength));
        this.session.steamId = proto.steamid;
        this.session.clientId = proto.clientSessionid;
        // steam expects a response to this jobId
        if (proto.jobidSource && !this.JOB_NONE.equals(proto.jobidSource)) {
            const key = (EMsgReceivedKey + "Response");
            this.jobidTargets.set(EMsg[key], proto.jobidSource);
            // we have this.jobIdTimeout ms to response to this jobId
            setTimeout(() => this.jobidTargets.delete(EMsg[key]), this.jobIdTimeout);
        }
        // service method
        if (EMsgReceived === EMsg.ServiceMethodResponse) {
            const serviceMethodCall = this.serviceMethodCalls.get(proto.jobidTarget.toString());
            const message = Protos.decode(serviceMethodCall?.method + "_Response", packet.readBuffer());
            this.serviceMethodCalls.delete(proto.jobidTarget.toString());
            return serviceMethodCall?.promiseResolve({
                EResult: proto.eresult,
                ...message,
            });
        }
        else if (EMsgReceived === EMsg.ServiceMethod) {
            console.debug(`unhandled service method: ${proto.targetJobName}`);
            return;
        }
        // decode body and emit message
        try {
            const body = Protos.decode("CMsg" + EMsgReceivedKey, packet.readBuffer());
            // emit message
            this.emit(EMsgReceivedKey, body);
            // response to sendProtoPromise
            const promiseResolve = this.protoResponses.get(EMsgReceived);
            if (promiseResolve) {
                this.protoResponses.delete(EMsgReceived);
                promiseResolve(body);
            }
            // start heartbeat if logged in successfully
            if (EMsgReceived === EMsg.ClientLogOnResponse) {
                const res = body;
                if (res.eresult === 1) {
                    this.startHeartBeat(res.heartbeatSeconds);
                }
            }
        }
        catch (error) {
            console.error(`Proto decode failed: ${EMsgReceivedKey}`);
        }
    }
    /**
     * Destroy connection to Steam and do some cleanup
     * disconnected is emmitted when error is passed
     */
    destroyConnection(error) {
        // make sure method is called only once
        if (this.connectionDestroyed)
            return;
        this.session = null;
        this.connectionDestroyed = true;
        // emmit if disconnect happened because of an error
        if (error)
            this.emit("disconnected", error);
        clearInterval(this.heartBeat);
    }
    /**
     * Heartbeat connection after login
     */
    startHeartBeat(beatTimeSecs) {
        this.heartBeat = setInterval(() => {
            this.sendProto(EMsg.ClientHeartBeat, {});
        }, beatTimeSecs * 1000);
    }
    /**
     * build header: [EMsg, CMsgProtoBufHeader length, CMsgProtoBufHeader]
     */
    buildProtoHeader(eMsg, serviceMethodCall) {
        const sBuffer = new SmartBuffer();
        // EMsg must be PROTO MASKED
        sBuffer.writeInt32LE(eMsg | this.PROTO_MASK);
        //CMsgProtoBufHeader
        const message = {
            steamid: this.session.steamId,
            clientSessionid: this.session.clientId,
            jobidTarget: this.jobidTargets.get(eMsg) || this.JOB_NONE,
            targetJobName: serviceMethodCall?.targetJobName,
            jobidSource: serviceMethodCall?.jobidSource || this.JOB_NONE,
        };
        // steam will receive response to this jobId
        this.jobidTargets.delete(eMsg);
        const CMsgProtoBufHeader = Protos.encode("CMsgProtoBufHeader", message);
        sBuffer.writeInt32LE(CMsgProtoBufHeader.length);
        sBuffer.writeBuffer(CMsgProtoBufHeader);
        return sBuffer.toBuffer();
    }
    async multi(payload) {
        const message = Protos.decode("CMsgMulti", payload);
        payload = message.messageBody;
        // message is gzipped
        if (message.sizeUnzipped) {
            payload = await new Promise((resolve) => {
                Zip.gunzip(payload, (err, unzipped) => {
                    if (err)
                        throw new SteamClientError(err.message);
                    resolve(unzipped);
                });
            });
        }
        while (payload.length) {
            const subSize = payload.readUInt32LE(0);
            this.decodeData(payload.subarray(4, 4 + subSize));
            payload = payload.subarray(4 + subSize);
        }
    }
}
