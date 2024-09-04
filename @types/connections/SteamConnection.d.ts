import { Socket } from 'net';

export interface Server {
    host: string;
    port: number;
}

export interface Authentication {
    user?: string;
    pass?: string;
}

export interface SteamConnectionOptions {
    steamCM: Server;
    httpProxy?: Server & Authentication;
    socksProxy?: Server & Authentication & { version: 4 | 5 };
    timeout: number;
}

export abstract class SteamConnection {
    protected socket: Socket;

    protected connected: boolean;

    readonly timeout: number;

    constructor(options: SteamConnectionOptions);

    protected connect(): Promise<void>;
    protected disconnect(): void;
    protected emit(event: string, ...args: any[]): void;
    send(buffer: Uint8Array): void;
    on(event: string, listener: (...args: any[]) => void): void;
    once(event: string, listener: (...args: any[]) => void): void;

    on(event: 'disconnected', listener: (error: Error) => void): this;
    once(event: 'disconnected', listener: (error: Error) => void): this;
}
