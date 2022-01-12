import Steam from "../app.js";
(async () => {
    const steam = new Steam();
    const options = {
        command: "connect",
        destination: { host: "162.254.192.87", port: 27021 },
        proxy: { host: "72.217.216.239", port: 4145, type: 4 },
        timeout: 15 * 1000,
    };
    await steam.connect(options, options.timeout);
    console.log("connected");
    try {
        const res = await steam.login({ accountName: "", password: "" });
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
})();
