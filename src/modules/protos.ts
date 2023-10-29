/**
 * Proto encode and decoder
 */
import ProtoBuf from "protobufjs";
import fs from "fs";
import { UnknownRecord } from "type-fest";
const rootDir = process.cwd() + "/resources/protos/";
const Protos = await loadProtos();

export { Protos as Root };

export function decode(type: string, body: Buffer) {
    const proto = Protos.lookupType(type);
    const payload = proto.decode(body);
    return proto.toObject(payload);
}

export function encode(type: string, body: UnknownRecord) {
    const proto = Protos.lookupType(type);
    const message = proto.create(body);
    const err = proto.verify(message);
    if (err) throw new Error(err);
    return Buffer.from(proto.encode(message).finish());
}

export async function loadProtos(): Promise<ProtoBuf.Root> {
    return new Promise((resolve, reject) => {
        fs.readdir(rootDir + "steam", (err, protoFileNames) => {
            if (err) return reject(err);
            const root = new ProtoBuf.Root();

            root.resolvePath = (origin, target) => {
                if (target.includes("google/protobuf")) {
                    return rootDir + target;
                } else {
                    return rootDir + "steam/" + target;
                }
            };

            root.load(protoFileNames, (err, root) => {
                if (err) return reject(err);
                if (!root) throw new Error("Could not load protos.");
                resolve(root);
            });
        });
    });
}
