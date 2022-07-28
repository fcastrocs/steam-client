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

export default class Connection extends EventEmitter {
  private socket;
  private sessionKey;
  private encrypted;
  private incompletePacket;
  private packetSize;
  private sessionId;
  private _steamId;
  private heartBeatId;
  private error;
  private readonly jobIdSources;
  private readonly options;
  protected readonly timeout: number;
  constructor(options: Options);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
  private directConnect;
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
   * Send message to steam [msgHdrProtoBuf, data]
   * if EMsg is passed, MsgHdrProtoBuf will be built automatically, and message will be encoded
   * if EMsg is not passed, assumes the message is already concated with MsgHdrProtoBuf
   */
  protected send(message: Buffer | LooseObject, EMsg?: number): void;
  /**
   * Build a MsgHdrProtoBuf buffer
   */
  private buildMsgHdrProtoBuf;
  /**
   * Read data sent by steam
   * header: Buffer of 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
   * Packet: Buffer of packetsize bytes
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
   * multi()
   */
  private unzipPayload;
  /**
   * Decide if message is encryption request or result
   */
  private encryptConnection;
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
