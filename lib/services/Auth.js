import NodeRSA from "node-rsa";
import SteamClientError from "../SteamClientError.js";
import { Language } from "../resources.js";
const EAuthSessionGuardType = Language.EAuthSessionGuardType;
export default class AuthService {
    steam;
    waitingForConfirmation = false;
    partialSession;
    serviceName = "Authentication";
    constructor(steam) {
        this.steam = steam;
    }
    /**
     * Login via QR
     * @emits "waitingForConfirmation" with QR challenge URL
     * @throws "LogonWasNotConfirmed"
     */
    async getAuthTokensViaQR() {
        this.checkLoggedStatus();
        // begin login by getting QR challenge URL
        const res = await this.steam.sendUnified(this.serviceName, "BeginAuthSessionViaQR", {
            deviceFriendlyName: this.steam.machineName,
            platformType: 1, // steam client
        });
        this.checkResult(res);
        // emit challengeUrl and poll for user respond
        this.steam.emit("waitingForConfirmation", {
            challengeUrl: res.challengeUrl,
        });
        // poll auth status until user responds to QR or timeouts
        return this.pollAuthStatusInterval(res.clientId, res.requestId);
    }
    /**
     * Login via Credentials
     * @emits "waitingForConfirmation" with confirmation type
     * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
     */
    async getAuthTokensViaCredentials(accountName, password) {
        this.checkLoggedStatus();
        const rsa = await this.steam.sendUnified(this.serviceName, "GetPasswordRSAPublicKey", { accountName });
        const res = await this.steam.sendUnified(this.serviceName, "BeginAuthSessionViaCredentials", {
            deviceFriendlyName: this.steam.machineName,
            accountName,
            encryptedPassword: this.encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
            encryptionTimestamp: rsa.timestamp,
            platformType: 1,
            persistence: 1,
            websiteId: "Client",
        });
        this.checkResult(res);
        const allowedConfirmations = res.allowedConfirmations.map((confirmation) => confirmation.confirmationType);
        if (allowedConfirmations.includes(EAuthSessionGuardType.unknown)) {
            throw new SteamClientError("SteamGuardIsUnknown");
        }
        if (allowedConfirmations.includes(EAuthSessionGuardType.none)) {
            throw new SteamClientError("SteamGuardIsDisabled");
        }
        let guardType;
        if (allowedConfirmations.includes(EAuthSessionGuardType.machineToken)) {
            guardType = EAuthSessionGuardType.machineToken;
        }
        // device confirmation. It seems like when deviceCode confirmation is present,
        // we can also use deviceConfirmation instead
        else if (allowedConfirmations.includes(EAuthSessionGuardType.deviceConfirmation) ||
            allowedConfirmations.includes(EAuthSessionGuardType.deviceCode)) {
            guardType = EAuthSessionGuardType.deviceConfirmation;
            // never seen this confirmation type
        }
        else if (allowedConfirmations.includes(EAuthSessionGuardType.emailConfirmation)) {
            guardType = EAuthSessionGuardType.emailConfirmation;
            // email code
        }
        else if (allowedConfirmations.includes(EAuthSessionGuardType.emailCode)) {
            guardType = EAuthSessionGuardType.emailCode;
        }
        this.steam.emit("waitingForConfirmation", {
            guardType: Language.EAuthSessionGuardTypeMap.get(guardType),
        });
        this.waitingForConfirmation = true;
        this.partialSession = res;
        return this.pollAuthStatusInterval(res.clientId, res.requestId);
    }
    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult
     */
    async updateWithSteamGuardCode(code, guardType) {
        if (!this.waitingForConfirmation)
            throw new SteamClientError("NotWaitingForConfirmation");
        // submit steam guard code
        const res = await this.steam.sendUnified(this.serviceName, "UpdateAuthSessionWithSteamGuardCode", {
            clientId: this.partialSession.clientId,
            steamid: this.partialSession.steamid,
            code,
            codeType: EAuthSessionGuardType[guardType],
        });
        this.checkResult(res);
        this.waitingForConfirmation = false;
    }
    /**
     * Poll auth session for auth tokens
     * Will stop after one minute of polling
     * @throws "LogonWasNotConfirmed"
     */
    pollAuthStatusInterval(clientId, requestId) {
        const ms = 5 * 1000;
        return new Promise((resolve) => {
            // clear interval after one minute, and fail login
            const timeout = setTimeout(() => {
                clearInterval(interval);
                throw new SteamClientError("LogonWasNotConfirmed");
            }, ms * 12);
            // poll auth status until user responds to QR or timeouts
            const interval = setInterval(async () => {
                const pollStatus = await this.steam.sendUnified(this.serviceName, "PollAuthSessionStatus", {
                    clientId,
                    requestId,
                });
                this.checkResult(pollStatus);
                // got new challenge
                if (pollStatus.newChallengeUrl) {
                    this.steam.emit("waitingForConfirmation", {
                        challengeUrl: pollStatus.newChallengeUrl,
                    });
                    clientId = pollStatus.newClientId;
                    return;
                }
                // no interaction from user
                if (!pollStatus.hadRemoteInteraction)
                    return;
                // user responded, but hasn't accepted login
                if (!pollStatus.refreshToken || !pollStatus.accessToken)
                    return;
                // user confirmed logon
                clearInterval(interval);
                clearTimeout(timeout);
                // emit authtokens
                resolve({
                    accountName: pollStatus.accountName,
                    refreshToken: pollStatus.refreshToken,
                    accessToken: pollStatus.accessToken,
                    machineName: this.steam.machineName,
                });
            }, ms);
        });
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
    checkLoggedStatus() {
        if (this.steam.isLoggedIn) {
            throw new SteamClientError("AlreadyLoggedIn");
        }
    }
    checkResult(res) {
        if (res.EResult !== Language.EResult.OK) {
            throw new SteamClientError("EResult: " + Language.EResultMap.get(res.EResult));
        }
    }
}
