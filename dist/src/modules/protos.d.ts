/// <reference types="node" resolution-mode="require"/>
/**
 * Proto encode and decoder
 */
import ProtoBuf from "protobufjs";
import { UnknownRecord } from "type-fest";
declare const Protos: ProtoBuf.Root;
export { Protos as Root };
export declare function decode(type: string, body: Buffer): {
    [k: string]: any;
};
export declare function encode(type: string, body: UnknownRecord): Buffer;
export declare function loadProtos(): Promise<ProtoBuf.Root>;
