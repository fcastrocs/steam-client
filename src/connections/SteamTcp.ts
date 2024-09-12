/* eslint-disable no-bitwise */
/**
 * Handle websocket connection to steam
 * Connection via HTTP, Socks v4 and v5 supported
 */
import crypto from 'crypto';
import tls, { ConnectionOptions } from 'tls';
import { Socket } from 'net';
import EventEmitter from 'events';
import type { SteamConnectionOptions } from '../../@types';
import Base from './Base';

export default class SteamTcp extends Base {
    constructor(protected emitter: EventEmitter) {
        super(emitter);
    }

    async connect(options: SteamConnectionOptions): Promise<void> {
        if (this.connected) {
            throw new Error('Already Connected');
        }

        this.options = options;
        this.url = new URL(`tcp://${this.options.steamCM.host}:${this.options.steamCM.port}/cmsocket/`);
        this.cleanedUp = false;

        try {
            this.connected = true;
        } catch (error) {
            this.cleanUp();
            throw error;
        }
    }

    public disconnect() {
        this.cleanUp();
    }

    send(buffer: Buffer) {
        if (this.connected) {
            const frame = this.createBinaryFrame(buffer);
            this.socket.write(frame);
        }
    }

    public createBinaryFrame(data: Buffer): Buffer {
        if (!this.connected) return null;

        return null;
    }

    public getPayloadFromFrame(data: Buffer): Buffer {
        if (!data.length) return null;

        return null;
    }
}
