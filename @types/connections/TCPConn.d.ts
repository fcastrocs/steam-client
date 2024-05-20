import { SteamClientError } from '../index.js';
import Base, { ConnectionOptions } from './Base.js';

export default class TCPConnection extends Base {
    protected options: ConnectionOptions;

    readonly timeout: number;
    constructor(options: ConnectionOptions);
    /**
     * Connect to Steam CM server.
     */
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
}
