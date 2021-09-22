import "jest";
import { SocksClientOptions } from "socks";
import Steam from "../src/index";

jest.setTimeout(6000);

describe("Steam", () => {
  const steam = new Steam();
  const timeout = 5000;

  it("should connect to steam", async () => {
    const socksOptions: SocksClientOptions = {
      proxy: {
        host: "",
        port: 1085,
        type: 4,
      },
      destination: {
        host: "",
        port: 27025,
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
