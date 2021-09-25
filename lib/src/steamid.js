"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const long_1 = __importDefault(require("long"));
/**
 * @returns 64-bit Steam ID
 */
function SteamIdToString(accountId) {
    const parsedId = parseInt(accountId, 10);
    // use default values
    const instance = 1;
    const type = 1;
    const universe = 1;
    const long = new long_1.default(parsedId, instance | (type << 20) | (universe << 24));
    return long.toString();
}
exports.default = SteamIdToString;
//# sourceMappingURL=steamid.js.map