import { Type } from 'protobufjs';

export interface Server {
    host: string;
    port: number;
}

export interface Authentication {
    user?: string;
    pass?: string;
}

interface CachedProtos {
    protosRoot: Root;
    preloadedTypes: Map<string, Type>;
}

export interface SteamConnectionOptions {
    steamCM: Server;
    httpProxy?: Server & Authentication;
    socksProxy?: Server & Authentication & { version: 4 | 5 };
    timeout: number;
    cachedProtos?: CachedProtos;
}

export abstract class SteamConnection {
    send(buffer: Uint8Array): void;
    on(event: string, listener: (...args: any[]) => void): void;
    once(event: string, listener: (...args: any[]) => void): void;
    disconnect(): void;
}
