/**
 * Handle low-level connection to steam.
 * Emits 'socket disconnected' if connection is lost
 */

import { EventEmitter } from "events";
import { SocksClient } from "socks";
import { Socket } from "net";
import { SmartBuffer } from "smart-buffer";
import Zip from "zlib";
import crc32 from "buffer-crc32";
import SteamCrypto from "@machiavelli/steam-client-crypto";
import { Language } from "./resources.js";
import * as Protos from "./protos.js";
import Long from "long";
import net from "net";
import SteamClientError from "./SteamClientError.js";
import IConnection, {
  ConnectionOptions,
  JobidSources,
  JobidTargets,
  ProtoResponses,
  Session,
  UnifiedMessage,
} from "../@types/connection.js";

const MAGIC = "VT01";
const PROTO_MASK = 0x80000000;
const JOB_NONE = Long.fromString("18446744073709551615", true);

abstract class Connection extends EventEmitter implements IConnection {
  public readonly timeout: number = 15000;

  private socket: Socket;
  private encrypted: boolean;
  private incompletePacket: boolean;
  private packetSize = 0;
  private readonly jobidSources: JobidSources = new Map();
  private readonly jobidTargets: JobidTargets = new Map();
  private readonly protoResponses: ProtoResponses = new Map();
  private heartBeatId: NodeJS.Timeout;
  private connectionDestroyed = false;
  private session: Session = {
    clientId: 0,
    key: null,
    steamId: Long.fromString("76561197960265728", true),
  };

  constructor(private options: ConnectionOptions) {
    super();

    // set timeout
    if (this.options.timeout) {
      if (this.options.timeout < 15000) {
        throw new SteamClientError("Timeout must be at least 15000 ms.");
      } else {
        this.timeout = this.options.timeout;
      }
    }
  }

  abstract disconnect(): void;

  /**
   * Connect to Steam CM server.
   */
  public async connect(): Promise<void> {
    // direct connection, no proxy
    if (!this.options.proxy) {
      this.socket = await this.directConnect();
    } else {
      this.socket = await this.proxyConnect();
    }

    this.socket.setTimeout(this.timeout);

    // start reading data
    this.socket.on("readable", () => this.readData());

    // wait for encryption handshake
    return new Promise((resolve, reject) => {
      // expect connection handshake before timeout
      const timeoutId = setTimeout(() => reject(new SteamClientError("Encryption handshake timeout.")), this.timeout);

      this.once("encryption-success", () => {
        clearTimeout(timeoutId);
        this.encrypted = true;
        this.sendProto(Language.EMsg.ClientHello, { protocolVersion: 65580 });

        // catch all transmission errors
        this.socket.on("error", (err) => this.destroyConnection(new SteamClientError(err.message)));

        resolve();
      });

      this.once("encryption-fail", () => {
        clearTimeout(timeoutId);
        this.destroyConnection();
        reject(new SteamClientError("Encryption handshake failed."));
      });
    });
  }

  private async directConnect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(this.options.steamCM);

      const errorListener = (error: Error) => reject(new SteamClientError(error.message));
      socket.once("error", errorListener);

      socket.once("connect", () => {
        socket.removeListener("error", errorListener);
        resolve(socket);
      });
    });
  }

  private async proxyConnect(): Promise<Socket> {
    try {
      const { socket } = await SocksClient.createConnection({
        destination: this.options.steamCM,
        proxy: this.options.proxy,
        command: "connect",
      });
      return socket;
    } catch (error) {
      throw new SteamClientError(error.message);
    }
  }

  /**
   * Destroy connection to Steam and do some cleanup
   * disconnected is emmitted when error is passed
   */
  protected destroyConnection(error?: SteamClientError) {
    // make sure this is called only once
    if (this.connectionDestroyed) return;
    this.connectionDestroyed = true;

    if (error) {
      this.emit("disconnected", error);
    }

    if (this.heartBeatId) {
      clearInterval(this.heartBeatId);
      this.heartBeatId = null;
    }

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }

  /**
   * Heartbeat connection after login
   */
  protected startHeartBeat(beatTimeSecs: number) {
    this.heartBeatId = setInterval(() => {
      this.sendProto(Language.EMsg.ClientHeartBeat, {});
    }, beatTimeSecs * 1000);
  }

  public sendProtoPromise(EMsg: number, payload: T, resEMsg?: number): Promise<T> {
    if (!this.encrypted) {
      throw new SteamClientError("Not connected to Steam.");
    }

    return new Promise((resolve) => {
      const EMsgName = resEMsg ? Language.EMsgMap.get(resEMsg) : Language.EMsgMap.get(EMsg) + "Response";
      this.protoResponses.set(EMsgName, resolve);
      this.sendProto(EMsg, payload);
    });
  }

  public sendProto(EMsg: number, payload: T) {
    const MsgHdrProtoBuf = this.buildMsgHdrProtoBuf(EMsg);
    payload = Protos.encode(`CMsg${Language.EMsgMap.get(EMsg)}`, payload);
    this.send(Buffer.concat([MsgHdrProtoBuf, payload]));
  }

  public sendUnified(serviceName: string, method: string, payload: T): Promise<T> {
    if (!this.encrypted) {
      throw new SteamClientError("Not connected to Steam.");
    }

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

      const EMsg = this.session.steamId.equals(Long.fromString("76561197960265728", true))
        ? Language.EMsg.ServiceMethodCallFromClientNonAuthed
        : Language.EMsg.ServiceMethodCallFromClient;

      const MsgHdrProtoBuf = this.buildMsgHdrProtoBuf(EMsg, unifiedMessage);
      payload = Protos.encode(method + "_Request", payload);
      this.send(Buffer.concat([MsgHdrProtoBuf, payload]));
    });
  }

  /**
   * Send packet to steam
   * message: Buffer(message.length, MAGIC, proto | channelEncryptResponse)
   */
  private send(message: Buffer) {
    // encrypt message
    if (this.encrypted) {
      message = SteamCrypto.encrypt(message, this.session.key.plain);
    }

    const packet = new SmartBuffer();

    packet.writeUInt32LE(message.length);
    packet.writeString(MAGIC);
    packet.writeBuffer(message);

    this.socket.write(packet.toBuffer());
  }

  /**
   * MsgHdrProtoBuf:
   * int EMsg
   * int CMsgProtoBufHeader length;
   * Proto CMsgProtoBufHeader buffer
   */
  private buildMsgHdrProtoBuf(EMsg: number, unifiedMessage?: UnifiedMessage): Buffer {
    const sBuffer = new SmartBuffer();

    //MsgHdrProtoBuf
    sBuffer.writeInt32LE(EMsg | PROTO_MASK);

    //CMsgProtoBufHeader
    const message: ProtoBufHeader = {
      steamid: this.session.steamId,
      clientSessionid: this.session.clientId,
      jobidTarget: this.jobidTargets.get(EMsg) || JOB_NONE,
      targetJobName: unifiedMessage?.targetJobName,
      jobidSource: unifiedMessage?.jobidSource || JOB_NONE, // unified messages
    };

    this.jobidTargets.delete(EMsg);

    const header = Protos.encode("CMsgProtoBufHeader", message);
    sBuffer.writeInt32LE(header.length);
    sBuffer.writeBuffer(header);

    return sBuffer.toBuffer();
  }

  /**
   * MsgHdr:
   * int EMsg
   * int CMsgProtoBufHeader length;
   * Proto CMsgProtoBufHeader buffer
   */
  private buildMsgHdr(EMsg: number): Buffer {
    const sBuffer = new SmartBuffer();
    sBuffer.writeUInt32LE(EMsg);
    sBuffer.writeBigUInt64LE(18446744073709551615n); //tarjetjobid
    sBuffer.writeBigUInt64LE(18446744073709551615n); //sourjobid
    return sBuffer.toBuffer();
  }

  /**
   * Read data sent by steam
   * header: 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
   * Packet: packetsize bytes
   */
  private readData() {
    // not waiting for a packet, decode header
    if (!this.incompletePacket) {
      const header: Buffer = this.socket.read(8);
      if (!header) return;

      this.packetSize = header.readUInt32LE(0);

      if (header.subarray(4).toString("ascii") != MAGIC) {
        this.destroyConnection(new SteamClientError("Connection is out of sync."));
        return;
      }
    }

    // read packet
    let packet = this.socket.read(this.packetSize);

    // we haven't received the complete packet
    if (!packet) {
      this.incompletePacket = true;
      return;
    }

    // got the complete packet, reset variables
    this.packetSize = 0;
    this.incompletePacket = false;

    // decrypt packet
    if (this.encrypted) {
      try {
        packet = SteamCrypto.decrypt(packet, this.session.key.plain);
      } catch (error) {
        this.destroyConnection(new SteamClientError("Data Encryption failed."));
        return;
      }
    }

    this.decodeData(packet);
  }

  /**
   * Decode data and emmit decoded payload
   * Packet has two parts: (MsgHdrProtoBuf or ExtendedClientMsgHdr) and payload message (proto)
   */
  private decodeData(data: Buffer) {
    const packet = SmartBuffer.fromBuffer(data);

    const rawEMsg = packet.readUInt32LE();
    const EMsg = rawEMsg & ~PROTO_MASK;
    const isProto = rawEMsg & PROTO_MASK;

    //console.log(Language.EMsgMap.get(EMsg));

    // Steam is sending encryption request or result
    if (!this.encrypted) {
      packet.readBigUInt64LE(); //jobidTarget 18446744073709551615n
      packet.readBigUInt64LE(); //jobidSource 18446744073709551615n

      if (EMsg === Language.EMsg.ChannelEncryptRequest) {
        return this.channelEncryptResponse(packet);
      }

      if (EMsg === Language.EMsg.ChannelEncryptResult) {
        return this.ChannelEncryptResult(packet);
      }
    }

    // package is gzipped, have to gunzip it first
    if (EMsg === Language.EMsg.Multi) {
      return this.multi(packet.readBuffer());
    }

    if (isProto) {
      // decode proto: headersize, header: [steamid, clientSessionid]
      const headerLength = packet.readUInt32LE();
      const CMsgProtoBufHeader = packet.readBuffer(headerLength);
      const body = Protos.decode("CMsgProtoBufHeader", CMsgProtoBufHeader) as ProtoBufHeader;

      if (!body.steamid.equals(Long.UZERO)) {
        this.session.steamId = body.steamid;
      }

      this.session.clientId = body.clientSessionid;

      // got a jobId that steam expects a respond to
      if (body.jobidSource && !JOB_NONE.equals(body.jobidSource)) {
        const key = (Language.EMsgMap.get(EMsg) + "Response") as keyof typeof Language.EMsg;
        this.jobidTargets.set(Language.EMsg[key], body.jobidSource);
      }

      // got response to a unified message
      if (body.jobidTarget && !JOB_NONE.equals(body.jobidTarget)) {
        const unifiedMessage = this.jobidSources.get(body.jobidTarget.toString());

        const message = Protos.decode(unifiedMessage.method + "_Response", packet.readBuffer());
        return unifiedMessage.resolve({ EResult: body.eresult, ...message });
      }
    } else {
      // Decode ExtendedClientMsgHdr
      packet.readBuffer(3); // skip 3 bytes. header size (1 byte) header version (2 bytes)
      packet.readBigUInt64LE(); //jobidTarget 18446744073709551615n
      packet.readBigUInt64LE(); //jobidSource 18446744073709551615n

      packet.readBuffer(1); // skip header canary (1 byte)

      const steamId = Long.fromString(packet.readBigUInt64LE().toString(), true);
      if (!steamId.equals(Long.UZERO)) {
        this.session.steamId = steamId;
      }

      this.session.clientId = packet.readInt32LE();

      if (EMsg !== Language.EMsg.ClientVACBanStatus) return;
    }

    if (EMsg === Language.EMsg.ServiceMethod) return;

    // manually handle this proto because there's no Proto for it
    if (EMsg === Language.EMsg.ClientVACBanStatus) {
      const bans = packet.readUInt32LE();
      this.emit("ClientVACBanStatus", {
        vac: !!bans,
      });
      return;
    }

    // decode protos and emit message
    const EMsgStr = Language.EMsgMap.get(EMsg);
    const message = Protos.decode("CMsg" + EMsgStr, packet.readBuffer());
    this.emit(EMsgStr, message);

    // response to sendProtoPromise
    const promiseResolve = this.protoResponses.get(Language.EMsgMap.get(EMsg));
    if (promiseResolve) {
      this.protoResponses.delete(Language.EMsgMap.get(EMsg));
      promiseResolve(message);
    }
  }

  private async multi(payload: Buffer): Promise<void> {
    const message = Protos.decode("CMsgMulti", payload);
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

  /**
   * Send connection encryption response.
   * Starts encryption handshake
   */
  private channelEncryptResponse(body: SmartBuffer) {
    const protocol = body.readUInt32LE();
    body.readUInt32LE(); // skip universe
    const nonce = body.readBuffer();

    this.session.key = SteamCrypto.genSessionKey(nonce);

    const MsgHdr = this.buildMsgHdr(Language.EMsg.ChannelEncryptResponse);

    // MsgChannelEncryptResponse
    const data = new SmartBuffer();
    const keycrc = crc32.unsigned(this.session.key.encrypted);
    data.writeUInt32LE(protocol);
    data.writeUInt32LE(this.session.key.encrypted.length);
    data.writeBuffer(this.session.key.encrypted);
    data.writeUInt32LE(keycrc);
    data.writeUInt32LE(0);

    this.send(Buffer.concat([MsgHdr, data.toBuffer()]));
  }

  /**
   * Connection encryption handshake result
   */
  private ChannelEncryptResult(body: SmartBuffer) {
    const EResult: number = body.readUInt32LE();
    // connection channel successfully encrypted
    if (EResult === Language.EResult.OK) {
      this.emit("encryption-success");
    } else {
      this.emit("encryption-fail");
    }
  }
}

export default Connection;
