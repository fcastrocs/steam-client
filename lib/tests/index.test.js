"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const index_1 = __importDefault(require("../src/index"));
jest.setTimeout(6000);
describe("Steam", () => {
    const steam = new index_1.default();
    const timeout = 5000;
    it("should connect to steam", async () => {
        const socksOptions = {
            proxy: {
                host: "",
                port: 0,
                type: 4, //4 or 5
            },
            destination: {
                host: "",
                port: 0,
            },
            command: "connect",
        };
        await steam.connect(socksOptions, timeout);
    });
    it("should login to steam", async () => {
        await steam.login({
            accountName: "",
            password: "",
        });
    });
    afterAll(() => {
        steam.destroyConnection();
    });
});
//# sourceMappingURL=index.test.js.map