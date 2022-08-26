/**
 * Proto encode and decoder
 */
import { LooseObject } from "../@types";
import resources from "./resources/index.js";
const Protos = resources.protos;

export function decode(type: string, body: Buffer): LooseObject {
  const proto = Protos.lookupType(type);
  const payload = proto.decode(body);
  return proto.toObject(payload);
}

export function encode(type: string, body: LooseObject) {
  const proto = Protos.lookupType(type);
  const message = proto.create(body);
  const err = proto.verify(message);
  if (err) throw new Error(err);
  return Buffer.from(proto.encode(message).finish());
}
