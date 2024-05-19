# Steam-Client

### A Node.js implementation of the Steam Client, as an API.

### Allows to programatically perform actions found in the Steam client for the purpose of automatization. This module will not manage anything for you.

New JWT auth system (QR Code, mobile confirmation, credential auth) is fully supported. The old system by login key and sentry files is unsupported.

## Installation

[npm page](https://www.npmjs.com/package/@fcastrocs/steamclient):

    $ npm i @fcastrocs/steamclient

Main class:

-   [Steam](#steam-)

This module is organized into services. Naming is as in the Protos

-   [Auth](#auth-)
-   [Client](#client-)
-   [Credentials](#credentials-)
-   [Econ](#econ-)
-   [Player](#player-)

### Note: Documentation contains TS types, refer to the @types folder to view typings.

# Steam [^](#steam)

### Getter methods

-   isLoggedIn: boolean
-   steamId: Long

### Events

event: "disconnected" - listener: (error: SteamClientError)
event: "accountLoggedOff" - listener (eresult: string)
event: "waitingForConfirmation"- listener (confirmation: Confirmation)
event: "personaStateChanged" - listener: (state: Friend)
event: "playingStateChanged" - listener: (state: PlayingSessionState)

### constructor(options: ConnectionOptions)

-   options is an object that must at least have the following properties:
-   steamCM

### connect(): Promise<void>

Establish connection with Steam server.

### disconnect()

Disconnect from Steam server. (Will not cause 'disconnected' event to emit)

### login(options: LoginOptions): Promise<AccountData>

-   options is an object that must at least have the following properties:
-   accountName, refreshToken

#### Sample code on how to connect to Steam.

```js
    const steamCM = { host: steamIP, port: steamPort };
    // you can also pass a socks proxy, checkout ConnectionOptions
    const options: ConnectionOptions = { steamCM };
    const steam = new Steam(options);
    await steam.connect();
```

# Auth [^](#auth)

A service to obtain authentication tokens (refresh and access JWT tokens)

### getAuthTokensViaQR(qrType: QRType): Promise<AuthTokens>

-   when "terminal" is passed, the QR code will be printed to the console.
-   when "image" is passsed, an img url will be returned.

### getAuthTokensViaCredentials(accountName, password): Promise<AuthTokens>

Login with credentials.

### updateWithSteamGuardCode(code)

Confirm auth with steam guard code.

#### Sample code on how to obtain auth tokens

```js
//  connect to steam  first

// QR code authentication
steam.once('waitingForConfirmation', (res) => console.log(res.qrCode));
// promise will reject after 2 minutes if QR is not scanned.
const authTokens = await steam.service.auth.getAuthTokensViaQR('terminal'); // can be "image"

// Credential authentication
steam.once('waitingForConfirmation', (res) => console.log(res.guardType));
// promise will reject after 2 minutes if authentication is not confirmed.
const authTokens = await steam.service.auth.getAuthTokensViaCredentials(
    accountName,
    password
);

// you must handle the logic within your app to be able to submit the steam guard code
// After this is called, then getAuthTokensViaCredentials will resolve with authTokens.
await steam.service.auth.updateWithSteamGuardCode(steamGuardCode);

// after getting authTokens, then you can login to steam
await steam.login({ refreshToken: authtokens.refreshToken });
```

# MORE TO COME SOON
