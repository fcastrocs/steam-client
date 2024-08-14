const SteamClient = require('./').default;

(async () => {
    console.time('Time TCP');
    for (let i = 0; i < 1; i++) {
        const steam = new SteamClient({ type: 'tcp', steamCM: { host: '162.254.196.68', port: 27017 }, minimal: true });
        await steam.connect();
        steam.disconnect();
    }
    console.timeEnd('Time TCP');

    // console.time('Time WS');
    // for (let i = 0; i < 500; i++) {
    //     const steam = new SteamClient({
    //         type: 'ws',
    //         steamCM: { host: 'ext3-iad1.steamserver.net', port: 27023 }
    //     });
    //     await steam.connect();
    //     steam.disconnect();
    // }
    // console.timeEnd('Time WS');
})();
