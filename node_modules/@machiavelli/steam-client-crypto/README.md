# steam-client-crypto

steam-web is a Node.js module that implements the Steam client connection encryption/decryption protocol.

## Installation

```sh
npm i @machiavelli/steam-client-crypto
```

## Usage
```javascript
import SteamCrypto from "@machiavelli/steam-client-crypto";

const hashedStr = SteamCrypto.sha1Hash("plaintext");
```

## Methods

- All methods are static.

```javascript
  /**
   * Generate a 32-byte symmetric sessionkey and encrypt it with Steam's public "System" key.
   * @param nonce - obtained in channelEncryptResponse when encrypting connection to Steam
   */
  static genSessionKey(nonce: Buffer): SessionKey;
  /**
   * Encrypt data to be sent to Steam
   */
  static encrypt(data: Buffer, key: SessionKey["plain"]): Buffer;
  /**
   * Decrypt data received from Steam
   */
  static decrypt(data: Buffer, key: SessionKey["plain"]): Buffer;
  /**
   * Hash a string or buffer with sha1
   * @returns hashed hex string
   */
  static sha1Hash(input: Buffer | string): string;
```
