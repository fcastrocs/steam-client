/**
 * Handle websocket connection to steam
 */
import Base, { ConnectionOptions } from './Base';
import { SteamClientError } from '../modules/common';

export default class WebSocketConnection extends Base {
    protected options: ConnectionOptions;

    private ws;

    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
    private registerEvents;
}
