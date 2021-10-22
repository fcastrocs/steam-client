"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
const resources_1 = __importDefault(require("./resources"));
const Protos = resources_1.default.protos;
function decode(type, body) {
    let proto;
    try {
        proto = Protos.lookupType(type);
    }
    catch (e) {
        throw new Error(`Proto not found. ${type}`);
    }
    const payload = proto.decode(body);
    return proto.toObject(payload);
}
exports.decode = decode;
function encode(type, body) {
    let proto;
    try {
        proto = Protos.lookupType(type);
    }
    catch (e) {
        throw new Error(`Proto not found. ${type}`);
    }
    const message = proto.create(body);
    const err = proto.verify(message);
    if (err) {
        throw new Error(err);
    }
    return proto.encode(message).finish();
}
exports.encode = encode;
