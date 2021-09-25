"use strict";
/**
 * Handle low-level connection to steam.
 * Emits 'socket disconnected' if connection is lost
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const socks_1 = require("socks");
const zlib_1 = __importDefault(require("zlib"));
const buffer_crc32_1 = __importDefault(require("buffer-crc32"));
const steam_crypto_ts_1 = __importDefault(require("steam-crypto-ts"));
const resources_1 = __importDefault(require("./resources/"));
const Protos = __importStar(require("./protos"));
const long_1 = __importDefault(require("long"));
const Language = resources_1.default.language;
const MAGIC = "VT01";
const PROTO_MASK = 0x80000000;
const MAX_UI64 = long_1.default.MAX_UNSIGNED_VALUE;
const MAX_I64 = long_1.default.MAX_VALUE;
class Connection extends events_1.EventEmitter {
    constructor() {
        super();
        this.socket = null;
        this.sessionKey = null;
        this._connected = false;
        this.encrypted = false;
        this.packetSize = 0;
        this.incompletePacket = false;
        this.sessionId = 0;
        this._steamId = long_1.default.fromString("76561197960265728", true);
        this.heartBeatId = null;
        // Map<Language.EMsg[EMsg], jobidSource>
        this.jobIdSources = new Map();
        this.timeout = 5000;
    }
    /**
     * Connect to Steam CM server.
     * Connection is successful until it is encrypted.
     */
    async connect(options, timeout) {
        if (this._connected)
            return Promise.reject(Error("already connected"));
        if (timeout) {
            this.timeout = timeout;
        }
        // attempt connection
        try {
            const info = await socks_1.SocksClient.createConnection(options);
            this.socket = info.socket;
            // consider proxy dead if there's no activity after timeout
            this.socket.setTimeout(this.timeout);
            this._connected = true;
        }
        catch (error) {
            // dead proxy or steam cm
            return Promise.reject("dead proxy or steamcm");
        }
        // register socket even listeners
        this.registerListeners();
        // wait for connection encryption
        return new Promise((resolve, reject) => {
            this.once("encryption-success", () => resolve());
            this.once("encryption-fail", () => {
                this.destroyConnection();
                reject("encryption failed");
            });
        });
    }
    getTimeout() {
        return this.timeout;
    }
    /**
     * Whether connection is ready: socket exits and connected and encrypted
     */
    isConnectionReady() {
        return !(!this.socket || (!this._connected && !this.encrypted));
    }
    /**
     * Destroy connection to Steam and do some cleanup
     */
    destroyConnection(forceDisconnect = false) {
        // dont emit 'disconnected' event when user forced disconnect
        if (!forceDisconnect) {
            this.emit("socket disconnected");
        }
        if (this.heartBeatId) {
            clearInterval(this.heartBeatId);
            this.heartBeatId = null;
        }
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.destroy();
            this.socket = null;
        }
    }
    /**
     * Heartbeat connection after login
     */
    startHeartBeat(beatTimeSecs) {
        if (!this.socket || !this._connected || !this.encrypted) {
            return;
        }
        // increase timeout so connection is not dropped in between heartbeats
        this.socket.setTimeout((beatTimeSecs + 5) * 1000);
        this.heartBeatId = setInterval(() => {
            this.send({}, Language.EMsg.ClientHeartBeat);
        }, beatTimeSecs * 1000);
    }
    /**
     * Send message to steam
     * if EMsg is passed, MsgHdrProtoBuf will be built automatically, and message will be encoded
     * if EMsg is not passed, assumes the mssage is already concat with MsgHdrProtoBuf
     */
    send(message, EMsg) {
        if (!this.socket || !this._connected) {
            return;
        }
        if (!EMsg && !(message instanceof Buffer)) {
            throw new Error("message must be a buffer if EMsg is not passed.");
        }
        else if (EMsg && message instanceof Buffer) {
            throw new Error("message must be a plain object if EMsg is passed.");
        }
        // build MsgHdrProtoBuf, encode message and concat
        if (EMsg && !(message instanceof Buffer)) {
            const header = this.buildMsgHdrProtoBuf(EMsg);
            const payloadBuff = Protos.encode(`CMsg${Language.EMsg[EMsg]}`, message);
            message = Buffer.concat([header, payloadBuff]);
        }
        // get rid of annoying ts type warning
        if (!(message instanceof Buffer)) {
            throw new Error("message must be a buffer.");
        }
        let buffMessage = message;
        // encrypt buffer
        if (this.encrypted && this.sessionKey) {
            buffMessage = steam_crypto_ts_1.default.symmetricEncryptWithHmacIv(message, this.sessionKey.plain);
        }
        const buf = Buffer.alloc(4 + 4 + buffMessage.length);
        buf.writeUInt32LE(buffMessage.length, 0);
        buf.write(MAGIC, 4);
        buffMessage.copy(buf, 8);
        this.socket.write(buf);
    }
    /**
     * Build a MsgHdrProtoBuf buffer
     */
    buildMsgHdrProtoBuf(EMsg) {
        //int EMsg
        //int CMsgProtoBufHeader length;
        //Proto CMsgProtoBufHeader buffer
        const buffer = Buffer.alloc(8);
        //MsgHdrProtoBuf
        buffer.writeInt32LE(EMsg | PROTO_MASK, 0);
        //CMsgProtoBufHeader
        const message = {
            steamid: this._steamId,
            clientSessionid: this.sessionId,
        };
        // check if there is a jobid for this response
        let jobIdSource;
        for (const key of this.jobIdSources.keys()) {
            if (Language.EMsg[EMsg].includes(key)) {
                jobIdSource = this.jobIdSources.get(key);
                this.jobIdSources.delete(key);
                break;
            }
        }
        if (jobIdSource) {
            message.jobidTarget = jobIdSource;
        }
        const data = Protos.encode("CMsgProtoBufHeader", message);
        buffer.writeInt32LE(data.length, 4); // headerLength
        return Buffer.concat([buffer, data]);
    }
    /**
     * Important socks events
     */
    registerListeners() {
        if (!this.socket)
            return;
        this.socket.on("close", () => {
            this.destroyConnection();
        });
        // transmission error, 'close' event is called after this
        this.socket.on("error", (err) => {
            console.error("SOCKS ERROR EVENT: " + err);
        });
        // this is just a notification, it doesn't cause disconnect.
        this.socket.on("timeout", () => {
            false;
        });
        this.socket.on("readable", () => {
            this.readData();
        });
    }
    /**
     * Read data sent by steam
     * header: Buffer of 8 bytes (uint packetsize 4 bytes, string MAGIC 4 bytes)
     * Packet: Buffer of packetsize bytes
     */
    readData() {
        if (!this.socket || !this._connected)
            return;
        // not waiting for a packet, decode header
        if (!this.incompletePacket) {
            const header = this.socket.read(8);
            if (!header) {
                return;
            }
            this.packetSize = header.readUInt32LE(0);
            if (header.slice(4).toString("ascii") != MAGIC) {
                this.emit("error", "***connection out of sync***");
                return;
            }
        }
        // read packet
        let packet = this.socket.read(this.packetSize);
        if (!packet) {
            // sometimes steam only sends the header so we must keep checking until steam sends it
            this.incompletePacket = true;
            return;
        }
        // we got the packet, reset variables
        this.packetSize = 0;
        this.incompletePacket = false;
        // decrypt packet
        if (this.encrypted && this.sessionKey) {
            try {
                packet = steam_crypto_ts_1.default.symmetricDecrypt(packet, this.sessionKey.plain);
            }
            catch (error) {
                this.emit("error", "***decryption failed***");
                return;
            }
        }
        // decode packet
        if (!this.encrypted) {
            this.encryptConnection(packet);
        }
        else {
            this.decodePacket(packet);
        }
    }
    /**
     * Decode packet and emmit decoded payload
     * Packet has two parts: (MsgHdrProtoBuf or ExtendedClientMsgHdr) and payload message (proto)
     */
    async decodePacket(packet) {
        if (!this.socket || !this._connected)
            return;
        const rawEMsg = packet.readUInt32LE(0);
        const EMsg = rawEMsg & ~PROTO_MASK;
        const isMsgHdrProtoBuf = rawEMsg & PROTO_MASK;
        let payload;
        //console.log(Language.EMsg[EMsg])
        // decode MsgHdrProtoBuf
        if (isMsgHdrProtoBuf) {
            const headerLength = packet.readUInt32LE(4);
            const CMsgProtoBufHeader = packet.slice(8, 8 + headerLength);
            const body = Protos.decode("CMsgProtoBufHeader", CMsgProtoBufHeader);
            if (body.steamid) {
                this._steamId = body.steamid;
            }
            if (body.clientSessionid) {
                this.sessionId = body.clientSessionid;
            }
            // got a jobId from steam, store it in the map for later use in a response to steam
            if (body.jobidSource &&
                !body.jobidSource.equals(MAX_I64) &&
                !body.jobidSource.equals(MAX_UI64)) {
                this.jobIdSources.set(Language.EMsg[EMsg], body.jobidSource);
            }
            payload = packet.slice(8 + headerLength);
        }
        else {
            // Decode ExtendedClientMsgHdr
            // skip headerSize(4 bytes) and HeaderVersion(2 bytes) index 0 and index 5
            //const targetJobID = packet.readBigUInt64LE(7);
            //const sourceJobID = packet.readBigUInt64LE(15);
            // skip headerCanary
            //const steamid = packet.readBigUInt64BE(24);
            //this.sessionId = packet.readInt32LE(32);
            payload = packet.slice(36);
            if (Language.EMsg[EMsg] !== "ClientVACBanStatus")
                return;
        }
        // payload is zipped
        if (EMsg === Language.EMsg.Multi) {
            await this.multi(payload);
        }
        else {
            // manually handle this proto because there's definition for it
            if (Language.EMsg[EMsg] === "ClientVACBanStatus") {
                const bans = payload.readUInt32LE(0);
                this.emit("CMsgClientVACBanStatus", {
                    vacbanned: bans === 0 ? false : true,
                });
                return;
            }
            // don't handle these proto because there's no Proto definition (for now)
            if (Language.EMsg[EMsg] === "ServiceMethod")
                return;
            if (Language.EMsg[EMsg] === "ClientFriendMsgEchoToSender")
                return;
            if (Language.EMsg[EMsg] === "ClientChatOfflineMessageNotification")
                return;
            if (Language.EMsg[EMsg] === "ClientFromGC")
                return;
            // decode payload and emit for index.ts to catch
            const type = "CMsg" + Language.EMsg[EMsg];
            const message = Protos.decode(type, payload);
            this.emit(type, message);
        }
    }
    /**
     * Unzip payload and decode it
     */
    async multi(payload) {
        const message = Protos.decode("CMsgMulti", payload);
        payload = message.messageBody;
        // check if paylaod is actually zipped (check later if this check is necessar)
        if (message.sizeUnzipped) {
            payload = await this.unzipPayload(payload);
        }
        while (payload.length) {
            const subSize = payload.readUInt32LE(0);
            this.decodePacket(payload.slice(4, 4 + subSize));
            payload = payload.slice(4 + subSize);
        }
    }
    /**
     * multi() helper function
     */
    unzipPayload(payload) {
        return new Promise((resolve) => {
            zlib_1.default.gunzip(payload, (err, unzipped) => {
                if (err) {
                    throw err;
                }
                resolve(unzipped);
            });
        });
    }
    /**
     * Decide if message is encryption request or result
     */
    encryptConnection(packet) {
        const rawEMsg = packet.readUInt32LE(0);
        const EMsg = rawEMsg & ~PROTO_MASK;
        // MsgHdr
        //skip targetJobID and sourceJobID
        const body = packet.slice(20, packet.byteLength);
        if (EMsg == Language.EMsg.ChannelEncryptRequest) {
            this.channelEncryptResponse(body);
        }
        else {
            this.ChannelEncryptResult(body);
        }
    }
    /**
     * Send connection encryption response
     */
    channelEncryptResponse(body) {
        const protocol = body.readUInt32LE(0);
        //const universe = body.readUInt32LE(4); //
        const nonce = body.slice(8, 24); // 16-bits
        // Generate a 32-byte symmetric session key and encrypt it with Steam's public "System" key.
        this.sessionKey = steam_crypto_ts_1.default.generateSessionKey(nonce);
        if (!this.sessionKey)
            return;
        const keycrc = buffer_crc32_1.default.unsigned(this.sessionKey.encrypted);
        let data = Buffer.alloc(4 + 8 + 8 + 4 + 4);
        // MsgHdr
        data.writeUInt32LE(Language.EMsg.ChannelEncryptResponse, 0);
        data.writeBigUInt64LE(18446744073709551615n, 4); //tarjetjobid
        data.writeBigUInt64LE(18446744073709551615n, 12); //sourjobid
        // MsgChannelEncryptResponse
        data.writeUInt32LE(protocol, 20);
        data.writeUInt32LE(this.sessionKey.encrypted.length, 24);
        data = Buffer.concat([data, this.sessionKey.encrypted]);
        const buff = Buffer.alloc(4 + 4);
        buff.writeUInt32LE(keycrc, 0);
        buff.writeUInt32LE(0, 4);
        this.send(Buffer.concat([data, buff]));
    }
    /**
     * Connection encryption result
     */
    ChannelEncryptResult(body) {
        const EResult = body.readUInt32LE(0);
        // connection channel successfully encrypted
        if (EResult === Language.EResult.OK) {
            this.encrypted = true;
            this.emit("encryption-success");
        }
        else {
            this.emit("encryption-fail");
        }
    }
}
exports.default = Connection;
//# sourceMappingURL=connection.js.map