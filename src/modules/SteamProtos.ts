/**
 * Proto encode and decoder
 */
import ProtoBuf, { Root } from 'protobufjs';
import fs from 'fs';
import { UnknownRecord } from 'type-fest';
import path from 'path';

export default class SteamProtos {
    private Protos: Root;

    private rootDir: string;

    constructor(protoRoot?: string) {
        this.rootDir = protoRoot ? path.resolve(__dirname, protoRoot) : path.resolve(__dirname, '../../../resources/protos');
        this.loadProtos();
    }

    private loadProtos() {
        const protoFileNames = fs.readdirSync(`${this.rootDir}/steam`);

        const root = new ProtoBuf.Root();

        root.resolvePath = (_origin, target) => {
            if (target.includes('google/protobuf')) {
                return `${this.rootDir}/${target}`;
            }
            return `${this.rootDir}/steam/${target}`;
        };

        this.Protos = root.loadSync(protoFileNames);
    }

    getProtosRoot() {
        return this.Protos;
    }

    encode(type: string, body: UnknownRecord) {
        const proto = this.Protos.lookupType(type);
        const message = proto.create(body);
        const err = proto.verify(message);
        if (err) throw new Error(err);
        return Buffer.from(proto.encode(message).finish());
    }

    decode(type: string, body: Buffer) {
        const proto = this.Protos.lookupType(type);
        const payload = proto.decode(body);
        return proto.toObject(payload);
    }
}
