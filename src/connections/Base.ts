/**
 * Handle low-level connection to steam.
 * Emits 'disconnected' if connection is lost
 *       'sendData' to catch in subclass
 */

import { EventEmitter } from "events";
import { SmartBuffer } from "smart-buffer";
import Zip from "zlib";
import { Language } from "../resources.js";
import * as Protos from "../protos.js";
import Long from "long";
import { SteamClientError } from "../common.js";
import { T } from "../../@types/common.js";
import { EMsg } from "../language/enums_clientserver.proto.js"
import { JobidSources, JobidTargets, ProtoResponses, Session, UnifiedMessage } from "../../@types/connections/Base.js";
import { CMsgMulti } from "../../@types/protos/protoResponse.js";

const JOB_NONE = Long.fromString("18446744073709551615", true);

export default abstract class Base extends EventEmitter {
  private heartBeat: NodeJS.Timer;
  protected readonly MAGIC = "VT01";
  protected readonly PROTO_MASK = 0x80000000;
  private connectionDestroyed = false;
  private readonly jobidSources: JobidSources = new Map();
  private readonly jobidTargets: JobidTargets = new Map();
  private readonly protoResponses: ProtoResponses = new Map();
  private session: Session = {
    clientId: 0,
    steamId: Long.fromString("76561197960265728", true),
  };
  protected connected = false;

  constructor() { super() }

  /**
  * Send proto message
  * [proto masked EMsg, proto header: [CMsgProtoBufHeader length, CMsgProtoBufHeader], steam proto]
  */
  public sendProto(EMsg: number, payload: T) {
    const protoHeader = this.buildProtoHeader(EMsg);
    payload = Protos.encode(`CMsg${Language.EMsgMap.get(EMsg)}`, payload);
    this.emit("sendData", Buffer.concat([protoHeader, payload]))
  }

  /**
   * Send proto message and wait for response
   */
  public sendProtoPromise(EMsg: number, payload: T, resEMsg?: number): Promise<T> {
    return new Promise((resolve) => {
      const EMsgName = resEMsg ? Language.EMsgMap.get(resEMsg) : Language.EMsgMap.get(EMsg) + "Response";
      this.protoResponses.set(EMsgName, resolve);
      this.sendProto(EMsg, payload);
    });
  }

  /**
  * Send steammessages_unified
  * [protoHeader, steam proto]
  */
  public sendUnified(serviceName: string, method: string, payload: T): Promise<T> {
    const targetJobName = `${serviceName}.${method}#1`;
    method = `C${serviceName}_${method}`;

    return new Promise((resolve) => {
      const jobidSource = Long.fromInt(Math.floor(Date.now() + Math.random()), true);
      const unifiedMessage: UnifiedMessage = {
        method,
        resolve,
        targetJobName,
        jobidSource,
      };

      this.jobidSources.set(jobidSource.toString(), unifiedMessage);
      
      // delete after 2 mins if never got response
      setTimeout(() => this.jobidSources.delete(jobidSource.toString()), 2 * 60 * 1000);
      const serviceMethodEMsg = this.session.steamId.equals(Long.fromString("76561197960265728", true))
        ? EMsg.ServiceMethodCallFromClientNonAuthed
        : EMsg.ServiceMethodCallFromClient;

      const protoHeader = this.buildProtoHeader(serviceMethodEMsg, unifiedMessage);
      payload = Protos.encode(method + "_Request", payload);
      this.emit("sendData", Buffer.concat([protoHeader, payload]))
    });
  }

  /**
   * Decode data and emmit decoded payload
   * [proto masked EMsg, proto header: [CMsgProtoBufHeader length, CMsgProtoBufHeader] | ExtendedClientMsgHdr, steam proto]
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

    if (isProto) {
      // [headersize, CMsgProtoBufHeader]
      const headerLength = packet.readUInt32LE();
      const CMsgProtoBufHeader = packet.readBuffer(headerLength);
      const body = Protos.decode("CMsgProtoBufHeader", CMsgProtoBufHeader) as CMsgProtoBufHeader;

      // got actual steamId from steam
      this.session.steamId = !body.steamid.equals(Long.UZERO) ? body.steamid : this.session.steamId
      this.session.clientId = body.clientSessionid;

      // got a jobId that steam expects a respond to
      if (body.jobidSource && !JOB_NONE.equals(body.jobidSource)) {
        const key = (Language.EMsgMap.get(EMsgReceived) + "Response") as keyof typeof EMsg;
        this.jobidTargets.set(EMsg[key], body.jobidSource);
      }

      // got response to a unified message
      if (body.jobidTarget && !JOB_NONE.equals(body.jobidTarget)) {
        const unifiedMessage = this.jobidSources.get(body.jobidTarget.toString());
        const message = Protos.decode(unifiedMessage.method + "_Response", packet.readBuffer());
        return unifiedMessage.resolve({ EResult: body.eresult, ...message });
      }
    } else {
      // Extended header
      // [headerSize(1 byte), headerVersion(2 bytes), jobidTarget(BigUInt64), jobidSource(BigUInt64), canary(1 byte), steamId(BigUInt64), clientId(Int32)]
      packet.readBuffer(3);
      const jobidTarget = packet.readBigUInt64LE();
      const jobidSource = packet.readBigUInt64LE();
      packet.readBuffer(1);
      const steamId = Long.fromString(packet.readBigUInt64LE().toString(), true);
      this.session.steamId = !steamId.equals(Long.UZERO) ? steamId : this.session.steamId
      this.session.clientId = packet.readInt32LE();
    }

    // manually handle this proto because there's no Proto for it
    if (EMsgReceived === EMsg.ClientVACBanStatus) {
      const bans = packet.readUInt32LE();
      this.emit("ClientVACBanStatus", { vac: !!bans });
      return;
    }

    // decode protos and emit message
    try {
      const EMsgKey = Language.EMsgMap.get(EMsgReceived);
      const message = Protos.decode("CMsg" + EMsgKey, packet.readBuffer());
      this.emit(EMsgKey, message);

      // response to sendProtoPromise
      const promiseResolve = this.protoResponses.get(EMsgKey);
      if (promiseResolve) {
        this.protoResponses.delete(EMsgKey);
        promiseResolve(message);
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
    this.connected = false;
    this.connectionDestroyed = true;

    // emmit if disconnect happened because of an error
    if (error) {
      this.emit("disconnected", error);
    }

    clearInterval(this.heartBeat);
  }

  /**
  * Heartbeat connection after login
  */
  public startHeartBeat(beatTimeSecs: number) {
    this.heartBeat = setInterval(() => {
      this.sendProto(EMsg.ClientHeartBeat, {});
    }, beatTimeSecs * 1000);
  }

  public get steamid() {
    return this.session.steamId;
  }

  /**
   * build CMsgHdrProtoBuf: [proto masked EMsg, CMsgProtoBufHeader length, CMsgProtoBufHeader]
  */
  private buildProtoHeader(EMsg: number, unifiedMessage?: UnifiedMessage): Buffer {
    const sBuffer = new SmartBuffer();

    sBuffer.writeInt32LE(EMsg | this.PROTO_MASK);

    //CMsgProtoBufHeader
    const message: CMsgProtoBufHeader = {
      steamid: this.session.steamId,
      clientSessionid: this.session.clientId,
      jobidTarget: this.jobidTargets.get(EMsg) || JOB_NONE,
      targetJobName: unifiedMessage?.targetJobName,
      jobidSource: unifiedMessage?.jobidSource || JOB_NONE, // unified messages
    };

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
