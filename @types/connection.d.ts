/**
 * Handle low-level connection to steam.
 */
import { EventEmitter } from "events";
import { LooseObject } from "@types";
import { Options } from "./index";

interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
}

export default abstract class Connection extends EventEmitter {
  private socket;
  private sessionKey;
  private encrypted;
  private incompletePacket;
  private packetSize;
  private sessionId;
  private _steamId;
  private readonly jobidSources;
  private heartBeatId;
  private error;
  private readonly options;
  protected readonly timeout: number;
  protected connectionDestroyed: boolean;
  constructor(options: Options);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
  private directConnect;
  private proxyConnect;
  /**
   * Important socks events
   */
  private registerListeners;
  /**
   * Disconnect from Steam CM server.
   */
  disconnect(): void;
  /**
   * Destroy connection to Steam and do some cleanup
   * silent is truthy when user destroys connection
   */
  protected destroyConnection(silent?: boolean): void;
  /**
   * Heartbeat connection after login
   */
  protected startHeartBeat(beatTimeSecs: number): void;
  /**
   * Send packet to steam
   * packet: [message.length, MAGIC, message]
   * message: [MsgHdrProtoBuf, payload] | [channelEncryptResponse]
   */
  protected send(options: SendOptions): void;
  /**
   * Build a MsgHdrProtoBuf
   */
  private buildMsgHdrProtoBuf;
  /**
   * Read data sent by steam
   * header: 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
   * Packet: packetsize bytes
   */
  private readData;
  /**
   * Decode packet and emmit decoded payload
   * Packet has two parts: (MsgHdrProtoBuf or ExtendedClientMsgHdr) and payload message (proto)
   */
  private decodePacket;
  /**
   * Unzip payload and decode it
   */
  private multi;
  /**
   * unzip payload in Multi
   */
  private unzipPayload;
  /**
   * Send connection encryption response.
   * Starts encryption handshake
   */
  private channelEncryptResponse;
  /**
   * Connection encryption handshake result
   */
  private ChannelEncryptResult;
}

interface ProtoBufHeader {
  steamid: Long;
  clientSessionid: number;
  jobidSource?: Long.Long;
  jobidTarget?: Long;
  targetJobName?: string;
}

interface SendOptions {
  EMsg?: number;
  payload?: LooseObject;
  message?: Buffer;
}
