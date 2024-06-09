/**
 * Proto encode and decoder
 */
import ProtoBuf, { Root } from 'protobufjs';
import fs from 'fs';
import { UnknownRecord } from 'type-fest';
import appRootPath from 'app-root-path';

const rootDir = `${appRootPath}/resources/protos/`;

export default class SteamProtos {
    private Protos: Root;

    constructor() {
        this.loadProtos();
    }

    private loadProtos() {
        const protoFileNames = fs.readdirSync(`${rootDir}steam`);

        const root = new ProtoBuf.Root();

        root.resolvePath = (_origin, target) => {
            if (target.includes('google/protobuf')) {
                return rootDir + target;
            }
            return `${rootDir}steam/${target}`;
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
