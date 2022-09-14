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

import IConnection, { ConnectionOptions, JobidSources, JobidTargets, Proto, Session } from "../@types/connection.js";

const MAGIC = "VT01";
const PROTO_MASK = 0x80000000;
const JOB_NONE = Long.fromString("18446744073709551615", true);

export default abstract class Connection extends EventEmitter implements IConnection {
  private socket: Socket;
  private encrypted: boolean;
  private incompletePacket: boolean;
  private packetSize = 0;
  private readonly jobidSources: JobidSources = new Map();
  private readonly jobidTargets: JobidTargets = new Map();
  private readonly options;
  public readonly timeout: number = 15000;
  private heartBeatId: NodeJS.Timeout;
  private error: SteamClientError;
  private connectionDestroyed = false;
  private session: Session = {
    clientId: 0,
    key: null,
    steamId: Long.fromString("76561197960265728", true),
  };

  constructor(options: ConnectionOptions) {
    super();
    this.options = options;

    // set timeout
    if (this.options.timeout) {
      if (this.options.timeout < 15000) {
        throw new SteamClientError("Timeout must be at least 15000 ms");
      } else {
        this.timeout = this.options.timeout;
      }
    }
  }

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

    // register socket events
    this.registerListeners();

    // wait for encryption handshake
    return new Promise((resolve, reject) => {
      // expect connection handshake before timeout
      const timeoutId = setTimeout(() => {
        this.destroyConnection(true);
        reject(new SteamClientError("HandShakeTimeout"));
      }, this.timeout);

      // connection successfull
      this.once("encryption-success", () => {
        clearTimeout(timeoutId);
        this.send({ EMsg: Language.EMsg.ClientHello, payload: { protocolVersion: 65580 } });
        resolve();
      });

      this.once("encryption-fail", () => {
        clearTimeout(timeoutId);
        this.destroyConnection(true);
        reject(new SteamClientError("SteamEncryptionFailed"));
      });
    });
  }

  private async directConnect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(this.options.steamCM);
      const errorListener = (error: Error) => {
        // convert Error to SteamClientError
        const err = new SteamClientError(error.message);
        err.stack = error.stack;
        reject(err);
      };
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
      // convert Error to SteamClientError
      const err = new SteamClientError(error.message);
      err.stack = error.stack;
      throw err;
    }
  }

  public get steamId() {
    return this.session.steamId;
  }

  /**
   * Important socks events
   */
  private registerListeners() {
    // start reading data
    this.socket.on("readable", () => this.readData());
    // transmission error,
    this.socket.on("error", (err) => {
      this.error = new SteamClientError(err.message);
      this.destroyConnection();
    });
  }

  /**
   * Silently disconnect from Steam CM server.
   */
  public disconnect() {
    this.destroyConnection(true);
  }

  /**
   * Destroy connection to Steam and do some cleanup
   * silent is truthy when user destroys connection
   */
  private destroyConnection(silent?: boolean) {
    // make sure this is called only once
    if (this.connectionDestroyed) return;
    this.connectionDestroyed = true;

    // only emit when connection drops unexpectedly
    if (!silent) {
      this.emit("disconnected", this.error);
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
      this.send({ EMsg: Language.EMsg.ClientHeartBeat, payload: {} });
    }, beatTimeSecs * 1000);
  }

  /**
   * Send packet to steam
   * message: Buffer(message.length, MAGIC, proto | channelEncryptResponse)
   */
  public send(message: Proto | Buffer) {
    // sending proto
    // build MsgHdrProtoBuf, encode message
    if (!Buffer.isBuffer(message)) {
      // jobid for unified message
      const jobId = message.unified?.jobId;
      const MsgHdrProtoBuf = this.buildMsgHdrProtoBuf(message.EMsg, jobId);
      const payload = jobId
        ? (message.payload as Buffer)
        : Protos.encode(`CMsg${Language.EMsgMap.get(message.EMsg)}`, message.payload);

      message = Buffer.concat([MsgHdrProtoBuf, payload]);
    }

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

  public sendUnified(serviceName: string, method: string, payload: T): Promise<T> {
    const targetJobName = `${serviceName}.${method}#1`;
    method = `C${serviceName}_${method}`;

    return new Promise((resolve) => {
      const jobId = Long.fromInt(Math.floor(Date.now() + Math.random()), true);
      this.jobidSources.set(jobId.toString(), { method, targetJobName, resolve });

      // delete after 2 mins if never got response
      setTimeout(() => this.jobidSources.delete(jobId.toString()), 2 * 60 * 1000);

      let EMsg;

      if (this.session.steamId.equals(Long.fromString("76561197960265728", true))) {
        EMsg = Language.EMsg.ServiceMethodCallFromClientNonAuthed;
      } else {
        EMsg = Language.EMsg.ServiceMethodCallFromClient;
      }

      const proto: Proto = {
        EMsg,
        payload: Protos.encode(method + "_Request", payload),
        unified: { jobId },
      };

      this.send(proto);
    });
  }

  /**
   * MsgHdrProtoBuf:
   * int EMsg
   * int CMsgProtoBufHeader length;
   * Proto CMsgProtoBufHeader buffer
   */
  private buildMsgHdrProtoBuf(EMsg: number, jobidSource: Long): Buffer {
    const sBuffer = new SmartBuffer();

    const unifiedMessage = jobidSource ? this.jobidSources.get(jobidSource.toString()) : null;

    //MsgHdrProtoBuf
    sBuffer.writeInt32LE(EMsg | PROTO_MASK);

    //CMsgProtoBufHeader
    const message: ProtoBufHeader = {
      steamid: this.session.steamId,
      clientSessionid: this.session.clientId,
      jobidTarget: this.jobidTargets.get(EMsg) || JOB_NONE,
      targetJobName: unifiedMessage?.targetJobName,
      jobidSource: jobidSource || JOB_NONE, // unified messages
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
        this.error = new SteamClientError("SteamConnectionOutOfSync");
        this.destroyConnection();
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
        this.error = new SteamClientError("SteamDataDecryptionFailed");
        this.destroyConnection();
        return;
      }
    }

    this.decodePacket(packet);
  }

  /**
   * Decode packet and emmit decoded payload
   * Packet has two parts: (MsgHdrProtoBuf or ExtendedClientMsgHdr) and payload message (proto)
   */
  private decodePacket(data: Buffer) {
    const packet = SmartBuffer.fromBuffer(data);

    const rawEMsg = packet.readUInt32LE();
    const EMsg = rawEMsg & ~PROTO_MASK;
    const isProto = rawEMsg & PROTO_MASK;

    console.log(Language.EMsgMap.get(EMsg));

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

    // package is zipped, have to unzip it first
    if (EMsg === Language.EMsg.Multi) {
      this.multi(packet.readBuffer());
      return;
    }

    // got proto
    else if (isProto) {
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
  }

  /**
   * Unzip payload and decode it
   */
  private async multi(payload: Buffer): Promise<void> {
    const message = Protos.decode("CMsgMulti", payload);
    payload = message.messageBody;

    // check if payload is actually zipped (check later if this check is necessary)
    if (message.sizeUnzipped) {
      payload = await this.unzipPayload(payload);
    }

    while (payload.length) {
      const subSize = payload.readUInt32LE(0);
      this.decodePacket(payload.subarray(4, 4 + subSize));
      payload = payload.subarray(4 + subSize);
    }
  }

  /**
   * unzip payload in Multi
   */
  private unzipPayload(payload: Buffer): Promise<Buffer> {
    return new Promise((resolve) => {
      Zip.gunzip(payload, (err, unzipped) => {
        if (err) {
          throw err;
        }
        resolve(unzipped as Buffer);
      });
    });
  }

  /**
   * Send connection encryption response.
   * Starts encryption handshake
   */
  private channelEncryptResponse(body: SmartBuffer) {
    const protocol = body.readUInt32LE();
    body.readUInt32LE(); // skip universe
    const nonce = body.readBuffer();

    // Generate a 32-byte symmetric session key and encrypt it with Steam's public "System" key.
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
      this.encrypted = true;
      this.emit("encryption-success");
    } else {
      this.emit("encryption-fail");
    }
  }
}
