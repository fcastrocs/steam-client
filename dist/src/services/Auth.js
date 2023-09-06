import NodeRSA from "node-rsa";
import QRCode from "qrcode";
import { EResultMap, EResult } from "../modules/language.js";
import { SteamClientError } from "../modules/common.js";
import EventEmitter from "events";
import { EAuthSessionGuardType, EAuthTokenPlatformType, ETokenRenewalType } from "../../language/steammessages_auth.steamclient.js";
import { EOSType } from "../../language/enums.steamd.js";
import { ESessionPersistence } from "../../language/enums.js";
export default class Auth extends EventEmitter {
    constructor(steam) {
        super();
        this.steam = steam;
        this.serviceName = "Authentication";
        this.timeout = 1 * 60 * 1000;
    }
    /**
     * Obtain auth tokens via QR
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult
     */
    async getAuthTokensViaQR() {
        if (this.steam.isLoggedIn)
            throw new SteamClientError("AlreadyLoggedIn");
        // begin login by getting QR challenge URL
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "BeginAuthSessionViaQR", {
            deviceDetails: {
                deviceFriendlyName: this.steam.machineName,
                platformType: EAuthTokenPlatformType.SteamClient,
                osType: EOSType.Win11,
                gamingDeviceType: 1,
                machineId: this.steam.machineId,
            },
            websiteId: "Unknown",
        });
        this.checkResult(res);
        this.waitingForConfirmation = true;
        this.partialSession = res;
        this.pollAuthStatusInterval();
        this.emit("waitingForConfirmation", {
            qrCode: await this.genQRCode(res.challengeUrl),
            timeout: this.timeout,
        });
    }
    /**
     * Obtain auth tokens via credentials
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
     */
    async getAuthTokensViaCredentials(accountName, password) {
        if (this.steam.isLoggedIn)
            throw new SteamClientError("AlreadyLoggedIn");
        const rsa = await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetPasswordRSAPublicKey", {
            accountName,
        });
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "BeginAuthSessionViaCredentials", {
            deviceFriendlyName: this.steam.machineName,
            accountName,
            encryptedPassword: this.encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
            encryptionTimestamp: rsa.timestamp,
            platformType: EAuthTokenPlatformType.SteamClient,
            persistence: ESessionPersistence.Persistent,
            websiteId: "Client",
        });
        this.checkResult(res);
        // confirmation type without auth tokens
        for (const item of res.allowedConfirmations) {
            if (item.confirmationType === EAuthSessionGuardType.Unknown) {
                throw new SteamClientError("SteamGuardIsUnknown");
            }
            if (item.confirmationType === EAuthSessionGuardType.None) {
                throw new SteamClientError("SteamGuardIsDisabled");
            }
        }
        this.waitingForConfirmation = true;
        this.partialSession = res;
        this.pollAuthStatusInterval();
        this.emit("waitingForConfirmation", {
            allowedConfirmations: res.allowedConfirmations,
            timeout: this.timeout,
        });
    }
    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    async updateWithSteamGuardCode(guardCode, guardType) {
        if (!this.waitingForConfirmation)
            throw new SteamClientError("NotWaitingForConfirmation");
        // submit steam guard code
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "UpdateAuthSessionWithSteamGuardCode", {
            clientId: this.partialSession.clientId,
            steamid: this.partialSession.steamid,
            code: guardCode,
            codeType: guardType,
        });
        this.checkResult(res);
    }
    async accessTokenGenerateForApp(refreshToken) {
        const res = await this.steam.conn.sendServiceMethodCall(this.serviceName, "AccessToken_GenerateForApp", {
            refreshToken,
            steamid: this.steam.steamId,
            renewalType: ETokenRenewalType.None,
        });
        this.checkResult(res);
        return res;
    }
    /**
     * Poll auth session for auth tokens
     * @emits "authTokens" "getAuthTokensTimeout"
     */
    pollAuthStatusInterval() {
        // timeout if did not respond to login attempt
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            this.emit("getAuthTokensTimeout");
        }, this.timeout);
        // poll auth status until user responds to QR or timeouts
        const intervalId = setInterval(async () => {
            const pollStatus = await this.steam.conn.sendServiceMethodCall(this.serviceName, "PollAuthSessionStatus", {
                clientId: this.partialSession.clientId,
                requestId: this.partialSession.requestId,
            });
            this.checkResult(pollStatus);
            // got new qr Code
            if (pollStatus.newChallengeUrl) {
                const qrCode = await this.genQRCode(pollStatus.newChallengeUrl);
                this.emit("waitingForConfirmation", {
                    qrCode,
                });
                this.partialSession.clientId = pollStatus.newClientId;
                return;
            }
            // newGuardData is sent with emailCode
            if (!pollStatus.newGuardData) {
                // no interaction from user
                if (!pollStatus.hadRemoteInteraction)
                    return;
                // user responded, but hasn't accepted login
                if (!pollStatus.refreshToken || !pollStatus.accessToken)
                    return;
            }
            // user confirmed logon
            this.waitingForConfirmation = false;
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            this.emit("authTokens", pollStatus);
        }, this.partialSession.interval * 1000);
    }
    async genQRCode(challengeUrl) {
        return {
            terminal: await QRCode.toString(challengeUrl, { type: "terminal", small: true, errorCorrectionLevel: "H" }),
            image: await QRCode.toDataURL(challengeUrl, { type: "image/webp" }),
        };
    }
    encryptPass(password, publickeyMod, publickeyExp) {
        const key = new NodeRSA();
        key.setOptions({
            encryptionScheme: "pkcs1",
            signingScheme: "pkcs1-sha256",
        });
        const mod2 = Buffer.from(publickeyMod, "hex");
        const exp2 = Buffer.from(publickeyExp, "hex");
        key.importKey({
            n: mod2,
            e: exp2,
        }, "components-public");
        return key.encrypt(password, "base64");
    }
    checkResult(res) {
        if (res.EResult !== EResult.OK) {
            throw new SteamClientError(EResultMap.get(res.EResult));
        }
    }
}
