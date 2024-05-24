/**
 * Handle TCP connection to steam
 */
import Base, { ConnectionOptions } from './Base.js';
import { SteamClientError } from '../modules/common.js';

export default class TCPConnection extends Base {
    protected options: ConnectionOptions;

    readonly timeout: number;

    private socket;

    private encrypted;

    private incompletePacket;

    private packetSize;

    private encryptionKey;

    constructor(options: ConnectionOptions);
    /**
     * Connect to Steam CM server.
     */
    connect(): Promise<void>;
    private directConnect;

    private proxyConnect;

    destroyConnection(error?: SteamClientError): void;
    /**
     * Send data
     * [message.length, MAGIC, message: [steam proto | channelEncryptResponse]]
     */
    private send;

    /**
     * Read data
     * [header, packet]
     * where header: 8 bytes [packetSize(UInt32), magic(4 bytes string)]
     */
    private readData;

    /**
     * Send connection encryption response.
     */
    private channelEncryptResponse;

    /**
     * Connection encryption handshake result
     */
    private ChannelEncryptResult;
}
