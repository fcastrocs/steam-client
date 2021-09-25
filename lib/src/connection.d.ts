/**
 * Handle low-level connection to steam.
 * Emits 'socket disconnected' if connection is lost
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import { SocksClientOptions } from "socks";
import { LooseObject } from "./types";
export default class Connection extends EventEmitter {
    private socket;
    private sessionKey;
    private _connected;
    private encrypted;
    private packetSize;
    private incompletePacket;
    private sessionId;
    private _steamId;
    private heartBeatId;
    private jobIdSources;
    private timeout;
    constructor();
    /**
     * Connect to Steam CM server.
     * Connection is successful until it is encrypted.
     */
    connect(options: SocksClientOptions, timeout?: number): Promise<void>;
    getTimeout(): number;
    /**
     * Whether connection is ready: socket exits and connected and encrypted
     */
    isConnectionReady(): boolean;
    /**
     * Destroy connection to Steam and do some cleanup
     */
    destroyConnection(forceDisconnect?: boolean): void;
    /**
     * Heartbeat connection after login
     */
    startHeartBeat(beatTimeSecs: number): void;
    /**
     * Send message to steam
     * if EMsg is passed, MsgHdrProtoBuf will be built automatically, and message will be encoded
     * if EMsg is not passed, assumes the mssage is already concat with MsgHdrProtoBuf
     */
    send(message: Buffer | LooseObject, EMsg?: number): void;
    /**
     * Build a MsgHdrProtoBuf buffer
     */
    private buildMsgHdrProtoBuf;
    /**
     * Important socks events
     */
    private registerListeners;
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
     * multi() helper function
     */
    private unzipPayload;
    /**
     * Decide if message is encryption request or result
     */
    private encryptConnection;
    /**
     * Send connection encryption response
     */
    private channelEncryptResponse;
    /**
     * Connection encryption result
     */
    private ChannelEncryptResult;
}
