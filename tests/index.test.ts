import { SocksClientOptions } from "socks";
import Steam from "../src";

describe("Steam", () => {
  const steam = new Steam();
  const timeout = 5000;

  beforeAll(() => {
    jest.setTimeout(6000);
  });

  it("should connect to steam", async () => {
    const socksOptions: SocksClientOptions = {
      proxy: {
        host: "85.208.87.152",
        port: 1085,
        type: 4, //4 or 5
      },
      destination: {
        host: "162.254.192.71",
        port: 27017,
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
