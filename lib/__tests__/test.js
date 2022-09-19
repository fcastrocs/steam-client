import Steam from "../Steam.js";
import assert from "assert";
//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0
const steamCM = { host: "162.254.192.71", port: 27017 };
const timeout = 15000;
let steam = null;
const refresh_token = "eyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInN0ZWFtIiwgInN1YiI6ICI3NjU2MTE5Nzk2MDQxMDA0NCIsICJhdWQiOiBbICJjbGllbnQiLCAid2ViIiwgInJlbmV3IiwgImRlcml2ZSIgXSwgImV4cCI6IDE2ODE3NzUyNzMsICJuYmYiOiAxNjYzNDMyNzM3LCAiaWF0IjogMTY2MzQzMjc0NywgImp0aSI6ICIxNjY1XzIxNEQzNEFEX0ZFNUE4IiwgIm9hdCI6IDE2NjM0MzI3NDcsICJwZXIiOiAxLCAiaXBfc3ViamVjdCI6ICIxMDguNTEuMTExLjgzIiwgImlwX2NvbmZpcm1lciI6ICIxNjYuMjA1LjE0Ny42IiB9.dGtVd4nDJI-7yjXIwD40MvOCJ98RcrQfKu8xS1zIrA-N4urSif_1_97T0Q6mtkU0B-0sNUvNJWfE4gYnonjGAQ";
describe("Test steam-client", () => {
    step("connect() should throw SteamClientError", async () => {
        steam = new Steam({ steamCM: { host: "0.0.0.0", port: 0 }, timeout });
        await assert.rejects(steam.connect(), (err) => {
            assert.equal(err.name, "steam-client");
            return true;
        });
        // test with proxy
        steam = new Steam({ steamCM, timeout, proxy: { host: "0.0.0.0", port: 0, type: 4 } });
        await assert.rejects(steam.connect(), (err) => {
            assert.equal(err.name, "steam-client");
            return true;
        });
    });
    // connect to steam
    step("connect()", async () => {
        const options = { steamCM, timeout };
        steam = new Steam(options);
        await steam.connect();
        await steam.login({
            accountName: "sky111222333@hotmail.com",
            accessToken: refresh_token,
            shouldRememberPassword: false,
        });
        await steam.action.idleGames([730], { forcePlay: true });
    });
    // login via QR
    // step("loginViarQR()", async () => {
    //   steam.on("waitingForConfirmation", (res) => {
    //     console.log(res.qrCode);
    //   });
    //   const authTokens = await steam.service.auth.getAuthTokensViaQR("terminal");
    //   console.log(authTokens);
    //   const res = await steam.login({ accountName: authTokens.accountName, accessToken: authTokens.refreshToken });
    //   console.log(res);
    // });
    // after(() => steam.disconnect());
});
