import { Options } from "../@types/connection.js";
import Steam from "./app.js";

//https://api.steampowered.com/ISteamDirectory/GetCMList/v1/?format=json&cellid=0

const steamCM = { host: "162.254.192.71", port: 27017 };
const timeout = 15000;

(async () => {
  const options: Options = { steamCM, timeout };
  const steam = new Steam(options);
  await steam.connect();
  console.log("Connected directly to steam");
 // await steam.login({ accountName: "gckramer@aol.com", password: "rembrant" });
  steam.disconnect();
})();

(async () => {
  const options: Options = {
    steamCM,
    timeout,
    proxy: { host: "185.242.109.176", port: 12324, userId: "14a702f14e36c", password: "96aeb6a487", type: 5 },
  };
  const steam = new Steam(options);
  await steam.connect();
  console.log("Connected directly to steam via proxy");

  await steam.login({ accountName: "gckramer@aol.com", password: "rembrant" });
  steam.disconnect();
})();
