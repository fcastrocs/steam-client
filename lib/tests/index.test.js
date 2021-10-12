"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe("Steam", () => {
    const steam = new index_1.default();
    const timeout = 10000;
    it("should connect to steam", async () => {
        const socksOptions = {
            proxy: {
                host: "",
                port: 12345,
                type: 5,
                userId: "",
                password: "",
            },
            destination: {
                host: "162.254.192.108",
                port: 27017,
            },
            command: "connect",
        };
        await steam.connect(socksOptions, timeout);
    });
    it("should login to steam", async () => {
        const res = await steam.login({
            accountName: "",
            loginKey: "",
            shaSentryfile: Buffer.from("sentry string", "hex"),
        });
        console.log(res.auth.loginKey);
        console.log(res.auth.sentry.toString("hex"));
    });
    afterAll(() => {
        steam.destroyConnection();
    });
});
