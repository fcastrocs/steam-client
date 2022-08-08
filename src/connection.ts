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
import * as SteamCrypto from "steam-crypto-esm";
import resources from "./resources/index.js";
import * as Protos from "./protos.js";
import Long from "long";
import net from "net";

import { ProtoBufHeader, SendOptions, SessionKey } from "../@types/connection.js";
import { Options } from "../@types";
import { SteamClientError } from "./app.js";

const Language = resources.language;
const MAGIC = "VT01";
const PROTO_MASK = 0x80000000;

export default abstract class Connection extends EventEmitter {
  private socket: Socket;
  private sessionKey: SessionKey;
  private encrypted: boolean;
  private incompletePacket: boolean;
  private packetSize = 0;
  private sessionId = 0;
  private _steamId: Long.Long = Long.fromString("76561197960265728", true);
  // Map<Language.EMsg[EMsg], jobidSource>
  private readonly jobidSources: Map<string, Long.Long> = new Map();
  private heartBeatId: NodeJS.Timeout;
  private error: SteamClientError;
  private readonly options;
  protected readonly timeout: number;
  protected connectionDestroyed = false;

  constructor(options: Options) {
    super();
    this.options = options;
    if (this.options.timeout) this.timeout = this.options.timeout;
    else this.timeout = 15000;
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

  /**
   * Important socks events
   */
  private registerListeners(): void {
    // start reading data
    this.socket.on("readable", () => this.readData());
    // transmission error,
    this.socket.on("error", (err) => {
      this.error = new SteamClientError(err.message);
      this.destroyConnection();
    });
  }

  /**
   * Disconnect from Steam CM server.
   */
  public disconnect(): void {
    this.destroyConnection(true);
  }

  /**
   * Destroy connection to Steam and do some cleanup
   * silent is truthy when user destroys connection
   */
  protected destroyConnection(silent?: boolean): void {
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
  protected startHeartBeat(beatTimeSecs: number): void {
    // increase timeout so connection is not dropped in between heartbeats
    this.socket.setTimeout((beatTimeSecs + 5) * 1000);
    this.heartBeatId = setInterval(() => {
      this.send({ EMsg: Language.EMsg.ClientHeartBeat, payload: {} });
    }, beatTimeSecs * 1000);
  }

  /**
   * Send packet to steam
   * packet: [message.length, MAGIC, message]
   * message: [MsgHdrProtoBuf, payload] | [channelEncryptResponse]
   */
  protected send(options: SendOptions): void {
    if (!this.socket) return;

    let message = options.message;

    // build MsgHdrProtoBuf, encode message
    if (options.EMsg && options.payload) {
      const MsgHdrProtoBuf = this.buildMsgHdrProtoBuf(options.EMsg);
      const payload = Protos.encode(`CMsg${Language.EMsg[options.EMsg]}`, options.payload);
      message = Buffer.concat([MsgHdrProtoBuf, payload]);
    }

    // encrypt message
    if (this.encrypted) {
      message = SteamCrypto.symmetricEncryptWithHmacIv(message, this.sessionKey.plain);
    }

    const packet = new SmartBuffer();

    packet.writeUInt32LE(message.length);
    packet.writeString(MAGIC);
    packet.writeBuffer(message);

    this.socket.write(packet.toBuffer());
  }

  /**
   * Build a MsgHdrProtoBuf
   */
  private buildMsgHdrProtoBuf(EMsg: number): Buffer {
    //int EMsg
    //int CMsgProtoBufHeader length;
    //Proto CMsgProtoBufHeader buffer

    const sBuffer = new SmartBuffer();

    //MsgHdrProtoBuf
    sBuffer.writeInt32LE(EMsg | PROTO_MASK);

    //CMsgProtoBufHeader
    const message: ProtoBufHeader = {
      steamid: this._steamId,
      clientSessionid: this.sessionId,
    };

    // steam is expecting a response to htis jobid
    message.jobidTarget = this.jobidSources.get(Language.EMsg[EMsg]);
    this.jobidSources.delete(Language.EMsg[EMsg]);

    const header = Protos.encode("CMsgProtoBufHeader", message);
    sBuffer.writeInt32LE(header.length);
    sBuffer.writeBuffer(header);

    return sBuffer.toBuffer();
  }

  /**
   * Read data sent by steam
   * header: 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
   * Packet: packetsize bytes
   */
  private readData(): void {
    if (!this.socket) return;

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
        packet = SteamCrypto.symmetricDecrypt(packet, this.sessionKey.plain);
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
  private decodePacket(data: Buffer): void {
    const packet = SmartBuffer.fromBuffer(data);

    const rawEMsg = packet.readUInt32LE();
    const EMsg = rawEMsg & ~PROTO_MASK;
    const isProto = rawEMsg & PROTO_MASK;

    // Steam is sending encryption request or result
    if (!this.encrypted) {
      packet.readBigUInt64LE(); //jobidTarget 18446744073709551615n
      packet.readBigUInt64LE(); //jobidSource 18446744073709551615n

      if (Language.EMsg[EMsg] === "ChannelEncryptRequest") {
        return this.channelEncryptResponse(packet);
      }

      if (Language.EMsg[EMsg] === "ChannelEncryptResult") {
        return this.ChannelEncryptResult(packet);
      }
    }

    // package is zipped, have to unzip it first
    if (Language.EMsg[EMsg] === "Multi") {
      this.multi(packet.readBuffer());
      return;
    }

    // got proto
    else if (isProto) {
      // decode proto: headersize, header: [steamid, clientSessionid]
      const headerLength = packet.readUInt32LE();
      const CMsgProtoBufHeader = packet.readBuffer(headerLength);
      const body = Protos.decode("CMsgProtoBufHeader", CMsgProtoBufHeader) as ProtoBufHeader;

      this._steamId = body.steamid;
      this.sessionId = body.clientSessionid;

      // got a jobId from steam, store it in the map for later use in a response to steam
      if (body.jobidSource) {
        this.jobidSources.set(Language.EMsg[EMsg] + "Response", body.jobidSource);
      }
    } else {
      // Decode ExtendedClientMsgHdr
      packet.readBuffer(3); // skip 3 bytes. header size (1 byte) header version (2 bytes)
      packet.readBigUInt64LE(); //jobidTarget 18446744073709551615n
      packet.readBigUInt64LE(); //jobidSource 18446744073709551615n

      packet.readBuffer(1); // skip header canary (1 byte)

      this._steamId = Long.fromString(packet.readBigUInt64LE().toString(), true);
      this.sessionId = packet.readInt32LE();

      if (Language.EMsg[EMsg] !== "ClientVACBanStatus") return;
    }

    // don't decode these messages because there's no proto for them
    if (Language.EMsg[EMsg] === "ServiceMethod") return;
    if (Language.EMsg[EMsg] === "ClientFriendMsgEchoToSender") return;
    if (Language.EMsg[EMsg] === "ClientChatOfflineMessageNotification") return;
    if (Language.EMsg[EMsg] === "ClientFromGC") return;

    // manually handle this proto because there's no Proto for it
    if (Language.EMsg[EMsg] === "ClientVACBanStatus") {
      const bans = packet.readUInt32LE(0);
      this.emit("CMsgClientVACBanStatus", {
        vacbanned: !!bans,
      });
      return;
    }

    // decode protos and emit message
    const type = "CMsg" + Language.EMsg[EMsg];
    const message = Protos.decode(type, packet.readBuffer());
    this.emit(type, message);
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
  private channelEncryptResponse(body: SmartBuffer): void {
    const protocol = body.readUInt32LE();
    const universe = body.readUInt32LE();
    const nonce = body.readBuffer();

    // Generate a 32-byte symmetric session key and encrypt it with Steam's public "System" key.
    this.sessionKey = SteamCrypto.generateSessionKey(nonce);
    if (!this.sessionKey) return;

    const keycrc = crc32.unsigned(this.sessionKey.encrypted);

    const data = new SmartBuffer();

    // MsgHdr
    data.writeUInt32LE(Language.EMsg.ChannelEncryptResponse);
    data.writeBigUInt64LE(18446744073709551615n); //tarjetjobid
    data.writeBigUInt64LE(18446744073709551615n); //sourjobid
    // MsgChannelEncryptResponse
    data.writeUInt32LE(protocol);
    data.writeUInt32LE(this.sessionKey.encrypted.length);
    data.writeBuffer(this.sessionKey.encrypted);

    data.writeUInt32LE(keycrc);
    data.writeUInt32LE(0);
    this.send({ message: data.toBuffer() });
  }

  /**
   * Connection encryption handshake result
   */
  private ChannelEncryptResult(body: SmartBuffer): void {
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
