/* eslint-disable import/prefer-default-export */
/**
 * Handle websocket connection to steam
 */
import { Base, ConnectionOptions } from './Base.js';
import { SteamClientError } from '../modules/common.js';

export class WebSocketConnection extends Base {
    protected options: ConnectionOptions;

    private ws;

    constructor(options: ConnectionOptions);
    connect(): Promise<void>;
    destroyConnection(error?: SteamClientError): void;
    private registerEvents;
}
