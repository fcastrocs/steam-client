/**
 * Proto encode and decoder
 */
import { T } from "../@types/common.js";
import { Protos } from "./resources.js";

export function decode(type: string, body: Buffer): Record<string, T> {
  const proto = Protos.lookupType(type);
  const payload = proto.decode(body);
  return proto.toObject(payload);
}

export function encode(type: string, body: Record<string, T>) {
  const proto = Protos.lookupType(type);
  const message = proto.create(body);
  const err = proto.verify(message);
  if (err) throw new Error(err);
  return Buffer.from(proto.encode(message).finish());
}
