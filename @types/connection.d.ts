/**
 * Handle low-level connection to steam.
 */
import { EventEmitter } from "events";
import Long from "long";
import { Socket } from "net";
import SteamClientError from "SteamClientError";

type JobidTargets = Map<number, Long>;
type JobidSources = Map<string, UnifiedMessage>;

interface SessionKey {
  plain: Buffer;
  encrypted: Buffer;
}

interface Session {
  clientId: number;
  key: SessionKey;
  steamId: Long;
}

interface UnifiedMessage {
  method: string;
  targetJobName: string;
  resolve: (value: T) => void;
}

interface Proto {
  EMsg: number;
  payload: Record<string, T> | Buffer;
  unified?: { jobId: Long };
}

interface ConnectionOptions {
  steamCM: SocksClientOptions["destination"];
  proxy?: SocksClientOptions["proxy"];
  timeout?: number;
}

export default abstract class Connection extends EventEmitter {
  on(event: "disconnected", listener: (error: SteamClientError) => void): this;

  private socket: Socket;
  private encrypted: boolean;
  private incompletePacket: boolean;
  private packetSize: number;
  private readonly jobidSources: JobidSources;
  private readonly jobidTargets: JobidTargets;
  private readonly options: ConnectionOptions;
  public readonly timeout: number;
  private heartBeatId: NodeJS.Timeout;
  private error: SteamClientError;
  private connectionDestroyed: boolean;
  private session: Session;

  constructor(options: ConnectionOptions);
  /**
   * Connect to Steam CM server.
   */
  connect(): Promise<void>;
  private directConnect;
  private proxyConnect;
  get steamId(): Long;
  /**
   * Important socks events
   */
  private registerListeners;
  /**
   * Silently disconnect from Steam CM server.
   */
  disconnect(): void;
  /**
   * Destroy connection to Steam and do some cleanup
   * silent is truthy when user destroys connection
   */
  private destroyConnection;
  /**
   * Heartbeat connection after login
   */
  protected startHeartBeat(beatTimeSecs: number): void;
  /**
   * Send packet to steam
   * message: Buffer(message.length, MAGIC, proto | channelEncryptResponse)
   */
  send(message: Proto | Buffer): void;
  sendUnified(serviceName: string, method: string, payload: T): Promise<T>;
  /**
   * MsgHdrProtoBuf:
   * int EMsg
   * int CMsgProtoBufHeader length;
   * Proto CMsgProtoBufHeader buffer
   */
  private buildMsgHdrProtoBuf;
  /**
   * MsgHdr:
   * int EMsg
   * int CMsgProtoBufHeader length;
   * Proto CMsgProtoBufHeader buffer
   */
  private buildMsgHdr;
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
