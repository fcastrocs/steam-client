/**
 * Proto encode and decoder
 */

import ProtoBuf, { Type } from 'protobufjs';
import fs from 'fs/promises';
import { UnknownRecord } from 'type-fest';
import path from 'path';
import { CachedProtos } from '../../@types';

export default class SteamProtos {
    private rootDir: string;

    private cachedProtos: CachedProtos = {
        protosRoot: null,
        preloadedTypes: new Map<string, Type>()
    };

    constructor(protosPath?: string) {
        this.rootDir = protosPath ? path.resolve(__dirname, protosPath) : path.resolve(__dirname, '../../../resources/protos');
    }

    async loadProtos(cachedProtos?: CachedProtos): Promise<CachedProtos> {
        if (this.isLoaded()) {
            return this.cachedProtos;
        }

        if (cachedProtos) {
            this.cachedProtos = cachedProtos;
            return this.cachedProtos;
        }

        const protoFileNames = await fs.readdir(`${this.rootDir}/steam`);

        const root = new ProtoBuf.Root();

        root.resolvePath = (_origin, target) => {
            if (target.includes('google/protobuf')) {
                return `${this.rootDir}/${target}`;
            }
            return `${this.rootDir}/steam/${target}`;
        };

        this.cachedProtos.protosRoot = await root.load(protoFileNames);
        return this.cachedProtos;
    }

    private isLoaded(): boolean {
        return !!this.cachedProtos.protosRoot;
    }

    encode(protoName: string, body: UnknownRecord): Buffer {
        const proto = this.getProtoType(protoName);
        const message = proto.create(body);
        const err = proto.verify(message);
        if (err) throw new Error(err);
        return Buffer.from(proto.encode(message).finish());
    }

    decode(protoName: string, body: Buffer) {
        const proto = this.getProtoType(protoName);
        const payload = proto.decode(body);
        return proto.toObject(payload);
    }

    private getProtoType(protoName: string): Type {
        if (!this.isLoaded()) {
            throw new Error('Protos have not been loaded.');
        }

        return (
            this.cachedProtos.preloadedTypes.get(protoName) ||
            this.cachedProtos.preloadedTypes.set(protoName, this.cachedProtos.protosRoot.lookupType(protoName)).get(protoName)
        );
    }
}
