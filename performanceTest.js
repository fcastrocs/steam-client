const SteamClient = require('./').default;

(async () => {
    console.time('Time TCP');
    const steam = new SteamClient({
        steamCM: { host: 'ext3-iad1.steamserver.net', port: 27037 }
    });
    await steam.connect();
    console.timeEnd('Time TCP');
})();
