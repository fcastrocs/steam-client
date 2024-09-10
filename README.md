Coming soon.

The whole purpose of this package is to implement an optimized and fast Steam Client in Node.js with the smallest overhead possible while keeping the code simple, and readable. No libraries have been imported to make the Steam connection, this was done in pure Node.js.
If you are looking for a complete Steam Client implementation, this is not it. However, if you are looking for a base to start your own project and value performance, and like TypeScript, then this is it.

Connection to Steam is done via Steam CM WebSockets only. TCP support has been dropped as the extra complexity is not worth it, and WebSockets are the preferred choice now. WebSockets found here: https://api.steampowered.com/ISteamDirectory/GetCMListForConnect/v1/?cmtype=websockets&realm=1

Connecting via HTTP and Socks v5 proxies are supported. Socks v4 will be implemented soon.
