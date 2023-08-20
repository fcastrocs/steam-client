/**
 * Handle low-level communication to steam.
 * Emits 'disconnected' if connection is lost
 *       'sendData' to catch in connection protocal subclass
 */

import { EventEmitter } from "events";
import { SmartBuffer } from "smart-buffer";
import Zip from "zlib";
import { Language } from "../modules/language.js";
import * as Protos from "../modules/protos.js";
import Long from "long";
import { SteamClientError } from "../modules/common.js";
import { EMsg } from "../language/enums_clientserver.proto.js";
import {
  ConnectionOptions,
  JobidTargets,
  ProtoResponses,
  ServiceMethodCall,
  Session,
} from "../../@types/connections/Base.js";
import { UnknownRecord, ValueOf } from "type-fest";
import { ClientLogonResponse } from "../../@types/protos/client.protos.js";

export default abstract class Base extends EventEmitter {
  private heartBeat!: NodeJS.Timer;
  protected readonly MAGIC = "VT01";
  protected readonly PROTO_MASK = 0x80000000;
  private JOB_NONE = Long.fromString("18446744073709551615", true);
  private jobIdTimeout = 3 * 60 * 1000;
  private connectionDestroyed = false;
  private readonly serviceMethodCalls: Map<string, ServiceMethodCall> = new Map();
  private readonly jobidTargets: JobidTargets = new Map();
  private readonly protoResponses: ProtoResponses = new Map();
  protected readonly timeout: number = 10000;
  private DEFAULT_STEAMID = Long.fromString("76561197960265728", true)
  private session: Session = {
    clientId: 0,
    steamId: this.DEFAULT_STEAMID,
  };

  constructor(protected options: ConnectionOptions) {
    super();
    // set timeout only if greater than current value
    this.timeout = options.timeout && options.timeout > this.timeout ? options.timeout : this.timeout;
  }

  /**
   * Send proto message
   */
  public sendProto(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord) {
    const protoHeader = this.buildProtoHeader(eMsg);
    const body = Protos.encode(`CMsg${Language.EMsgMap.get(eMsg)}`, payload);
    this.emit("sendData", Buffer.concat([protoHeader, body]));
  }

  /**
   * Send proto message and wait for response
   */
  public sendProtoPromise(eMsg: ValueOf<typeof EMsg>, payload: UnknownRecord, resEMsg?: ValueOf<typeof EMsg>): Promise<UnknownRecord> {
    return new Promise((resolve) => {
      const resEMsgKey = (resEMsg ? Language.EMsgMap.get(resEMsg) : Language.EMsgMap.get(eMsg) + "Response") as keyof typeof EMsg;
      if (!resEMsgKey || !EMsg[resEMsgKey]) throw new SteamClientError("Specified EMsg does not exist.")
      this.protoResponses.set(resEMsgKey, resolve);
      this.sendProto(eMsg, payload);
    });
  }

  /**
   * Send service method call
   */
  public sendServiceMethodCall(serviceName: string, method: string, body: UnknownRecord): Promise<UnknownRecord> {
    const targetJobName = `${serviceName}.${method}#1`;
    method = `C${serviceName}_${method}`;
    const jobidSource = Long.fromInt(Math.floor(Date.now() + Math.random()), true);

    return new Promise((resolve) => {
      const serviceMethodCall: ServiceMethodCall = {
        method,
        promiseResolve: resolve,
        targetJobName,
        jobidSource,
      };

      // save jobId that steam will send a response to
      this.serviceMethodCalls.set(jobidSource.toString(), serviceMethodCall);

      // steam has this.jobIdTimeout ms to response to this jobId
      setTimeout(() => this.serviceMethodCalls.delete(jobidSource.toString()), this.jobIdTimeout);

      const serviceMethodEMsg = this.session.steamId.equals(this.DEFAULT_STEAMID)
        ? EMsg.ServiceMethodCallFromClientNonAuthed
        : EMsg.ServiceMethodCallFromClient;

      const protoHeader = this.buildProtoHeader(serviceMethodEMsg, serviceMethodCall);
      const buffer = Protos.encode(method + "_Request", body);
      this.emit("sendData", Buffer.concat([protoHeader, buffer]));
    });
  }

  public isLoggedIn() {
    return (
      this.session && this.session.steamId !== this.DEFAULT_STEAMID && this.session.clientId !== 0
    );
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
  protected decodeData(data: Buffer) {
    const packet = SmartBuffer.fromBuffer(data);

    const rawEMsg = packet.readUInt32LE();
    const EMsgReceived = rawEMsg & ~this.PROTO_MASK;
    const isProto = rawEMsg & this.PROTO_MASK;

    // package is gzipped, have to gunzip it first
    if (EMsgReceived === EMsg.Multi) {
      return this.multi(packet.readBuffer());
    }

    if (!isProto) {
      // Extended header
      const headerSize = packet.readUInt8();
      const headerVersion = packet.readUInt16LE();
      const targetJobId = packet.readBigUInt64LE();
      const sourceJobId = packet.readBigUInt64LE();
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
    const proto = Protos.decode("CMsgProtoBufHeader", packet.readBuffer(headerLength)) as CMsgProtoBufHeader;
    this.session.steamId = proto.steamid;
    this.session.clientId = proto.clientSessionid;

    // steam expects a response to this jobId
    if (proto.jobidSource && !this.JOB_NONE.equals(proto.jobidSource)) {
      const key = (Language.EMsgMap.get(EMsgReceived) + "Response") as keyof typeof EMsg;
      this.jobidTargets.set(EMsg[key], proto.jobidSource);
      // we have this.jobIdTimeout ms to response to this jobId
      setTimeout(() => this.jobidTargets.delete(EMsg[key]), this.jobIdTimeout);
    }

    if (EMsgReceived === EMsg.ServiceMethodResponse) {
      const serviceMethodCall = this.serviceMethodCalls.get(proto.jobidTarget.toString());
      const message = Protos.decode(serviceMethodCall?.method + "_Response", packet.readBuffer());
      this.serviceMethodCalls.delete(proto.jobidTarget.toString());
      return serviceMethodCall?.promiseResolve({ EResult: proto.eresult, ...message });
    }

    // decode body and emit message
    try {
      const EMsgKey = Language.EMsgMap.get(EMsgReceived);
      const body = Protos.decode("CMsg" + EMsgKey, packet.readBuffer());

      // emit message 
      this.emit(EMsgKey!, body);

      // response to sendProtoPromise
      const promiseResolve = this.protoResponses.get(EMsgKey!);
      if (promiseResolve) {
        this.protoResponses.delete(EMsgKey!);
        promiseResolve(body);
      }

      // start heartbeat if logged in successfully
      if (EMsgReceived === EMsg.ClientLogonResponse) {
        const res = body as ClientLogonResponse;
        if (res.eresult === 1) {
          this.startHeartBeat(res.heartbeatSeconds);
        }
      }
    } catch (error) {
      // console.error("Proto decode failed.");
      // console.log(Language.EMsgMap.get(EMsgReceived))
    }
  }

  /**
   * Destroy connection to Steam and do some cleanup
   * disconnected is emmitted when error is passed
   */
  protected destroyConnection(error?: SteamClientError) {
    // make sure method is called only once
    if (this.connectionDestroyed) return;
    this.session = null!;
    this.connectionDestroyed = true;

    // emmit if disconnect happened because of an error
    if (error) this.emit("disconnected", error);

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
  private buildProtoHeader(EMsg: number, serviceMethodCall?: ServiceMethodCall): Buffer {
    const sBuffer = new SmartBuffer();

    // EMsg must be PROTO MASKED
    sBuffer.writeInt32LE(EMsg | this.PROTO_MASK);

    //CMsgProtoBufHeader
    const message: CMsgProtoBufHeader = {
      steamid: this.session.steamId,
      clientSessionid: this.session.clientId,
      jobidTarget: this.jobidTargets.get(EMsg) || this.JOB_NONE,
      targetJobName: serviceMethodCall?.targetJobName,
      jobidSource: serviceMethodCall?.jobidSource || this.JOB_NONE,
    };

    // steam will receive response to this jobId
    this.jobidTargets.delete(EMsg);

    const CMsgProtoBufHeader = Protos.encode("CMsgProtoBufHeader", message);
    sBuffer.writeInt32LE(CMsgProtoBufHeader.length);
    sBuffer.writeBuffer(CMsgProtoBufHeader);

    return sBuffer.toBuffer();
  }

  private async multi(payload: Buffer): Promise<void> {
    const message = Protos.decode("CMsgMulti", payload) as CMsgMulti;
    payload = message.messageBody;

    // message is gzipped
    if (message.sizeUnzipped) {
      payload = await new Promise((resolve) => {
        Zip.gunzip(payload, (err, unzipped) => {
          if (err) throw new SteamClientError(err.message);
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
