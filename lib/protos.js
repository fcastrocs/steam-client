/**
 * Proto encode and decoder
 */
import { Protos } from "./resources.js";
export function decode(type, body) {
    const proto = Protos.lookupType(type);
    const payload = proto.decode(body);
    return proto.toObject(payload);
}
export function encode(type, body) {
    const proto = Protos.lookupType(type);
    const message = proto.create(body);
    const err = proto.verify(message);
    if (err)
        throw new Error(err);
    return Buffer.from(proto.encode(message).finish());
}
