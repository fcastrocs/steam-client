import { SocksClientOptions } from "socks";
import Steam from "../src/index";

describe("Steam", () => {
  const steam = new Steam();
  const timeout = 10000;

  it("should connect to steam", async () => {
    const socksOptions: SocksClientOptions = {
      proxy: {
        host: "",
        port: 12324,
        type: 5, //4 or 5
        userId: "",
        password: "",
      },
      destination: {
        host: "162.254.192.100",
        port: 27017,
      },
      command: "connect",
    };

    await steam.connect(socksOptions, timeout);
  });

  it("should login to steam", async () => {
    const res = await steam.login({
      accountName: "",
      password: "",
      shaSentryfile: Buffer.from("sentry string", "hex"),
    });
    console.log(res.auth.loginKey);
    console.log(res.auth.sentry.toString("hex"));
  });

  afterAll(() => {
    steam.destroyConnection();
  });
});
