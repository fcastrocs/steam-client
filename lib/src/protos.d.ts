/// <reference types="node" />
import { LooseObject } from "types";
export declare function decode(type: string, body: Buffer): LooseObject;
export declare function encode(type: string, body: LooseObject): Uint8Array;
