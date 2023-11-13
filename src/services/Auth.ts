import NodeRSA from "node-rsa";
import QRCode from "qrcode";
import Steam from "../Steam.js";
import Language from "../modules/language.js";
import { SteamClientError } from "../modules/common.js";
import EventEmitter from "events";
import { EOSType } from "../../resources/language/enums.steamd.js";
import { Confirmation } from "../../@types/services/Auth.js";
import { UnknownRecord, ValueOf } from "type-fest";
import type {
    CAuthentication_BeginAuthSessionViaCredentials_Response,
    CAuthentication_BeginAuthSessionViaQR_Response,
    CAuthentication_GetPasswordRSAPublicKey_Response,
    CAuthentication_UpdateAuthSessionWithSteamGuardCode_Response,
    CAuthentication_AccessToken_GenerateForApp_Response,
    CAuthentication_PollAuthSessionStatus_Response,
    CAuthentication_BeginAuthSessionViaCredentials_Request,
} from "../../@types/protos/steammessages_auth.steamclient.js";
import { ESessionPersistence } from "../../resources/language/enums.js";
import { EAuthTokenPlatformType, EAuthSessionGuardType, ETokenRenewalType } from "../../resources/language/steammessages_auth.steamclient.js";
const { EResultMap, EResult } = Language;

export default class Auth extends EventEmitter {
    private waitingForConfirmation: boolean;
    private partialSession: CAuthentication_BeginAuthSessionViaCredentials_Response | CAuthentication_BeginAuthSessionViaQR_Response;
    private readonly serviceName = "Authentication";
    private readonly timeout = 1 * 60 * 1000;
    constructor(private steam: Steam) {
        super();
    }

    /**
     * Obtain auth tokens via QR
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult
     */
    public async getAuthTokensViaQR() {
        if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

        // begin login by getting QR challenge URL
        const res: CAuthentication_BeginAuthSessionViaQR_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "BeginAuthSessionViaQR", {
            deviceDetails: {
                deviceFriendlyName: this.steam.machineName,
                platformType: EAuthTokenPlatformType.SteamClient, //as unknown as typeof EAuthTokenPlatformType,
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
        } as Confirmation);
    }

    /**
     * Obtain auth tokens via credentials
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
     */
    public async getAuthTokensViaCredentials(
        accountName: string,
        password: string,
        options?: { returnResponse: boolean }
    ): Promise<CAuthentication_BeginAuthSessionViaCredentials_Response> {
        if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

        const rsa: CAuthentication_GetPasswordRSAPublicKey_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetPasswordRSAPublicKey", {
            accountName,
        });

        const res: CAuthentication_BeginAuthSessionViaCredentials_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "BeginAuthSessionViaCredentials", {
            accountName,
            encryptedPassword: this.encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
            encryptionTimestamp: rsa.timestamp,
            rememberLogin: true,
            persistence: ESessionPersistence.Persistent,
            websiteId: "Unknown",
            language: 0,
            deviceDetails: {
                deviceFriendlyName: this.steam.machineName,
                platformType: EAuthTokenPlatformType.SteamClient,
                osType: EOSType.Win11,
                gamingDeviceType: 1,
                machineId: this.steam.machineId,
            },
        } as CAuthentication_BeginAuthSessionViaCredentials_Request);

        this.checkResult(res);

        if (options && options.returnResponse) {
            return res;
        }

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
        } as Confirmation);

        return null;
    }

    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    public async updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType) {
        if (!this.waitingForConfirmation) throw new SteamClientError("NotWaitingForConfirmation");

        // submit steam guard code
        const res: CAuthentication_UpdateAuthSessionWithSteamGuardCode_Response = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            "UpdateAuthSessionWithSteamGuardCode",
            {
                clientId: this.partialSession.clientId,
                steamid: (this.partialSession as CAuthentication_BeginAuthSessionViaCredentials_Response).steamid,
                code: guardCode,
                codeType: guardType as unknown as number,
            }
        );

        this.checkResult(res);
    }

    public async accessTokenGenerateForApp(refreshToken: string) {
        const res: CAuthentication_AccessToken_GenerateForApp_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "AccessToken_GenerateForApp", {
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
    private pollAuthStatusInterval() {
        // timeout if did not respond to login attempt
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            this.emit("getAuthTokensTimeout");
        }, this.timeout);

        // poll auth status until user responds to QR or timeouts
        const intervalId = setInterval(async () => {
            const pollStatus: CAuthentication_PollAuthSessionStatus_Response = await this.steam.conn.sendServiceMethodCall(this.serviceName, "PollAuthSessionStatus", {
                clientId: this.partialSession.clientId,
                requestId: this.partialSession.requestId,
            });

            this.checkResult(pollStatus);

            // got new qr Code
            if (pollStatus.newChallengeUrl) {
                const qrCode = await this.genQRCode(pollStatus.newChallengeUrl);

                this.emit("waitingForConfirmation", {
                    qrCode,
                } as Confirmation);

                this.partialSession.clientId = pollStatus.newClientId;
                return;
            }

            // newGuardData is sent with emailCode
            if (!pollStatus.newGuardData) {
                // no interaction from user
                if (!pollStatus.hadRemoteInteraction) return;
                // user responded, but hasn't accepted login
                if (!pollStatus.refreshToken || !pollStatus.accessToken) return;
            }

            // user confirmed logon
            this.waitingForConfirmation = false;
            clearInterval(intervalId);
            clearTimeout(timeoutId);

            this.emit("authTokens", pollStatus);
        }, this.partialSession.interval * 1000);
    }

    private async genQRCode(challengeUrl: string) {
        return {
            terminal: await QRCode.toString(challengeUrl, { type: "terminal", small: true, errorCorrectionLevel: "H" }),
            image: await QRCode.toDataURL(challengeUrl, { type: "image/webp" }),
        };
    }

    private encryptPass(password: string, publickeyMod: string, publickeyExp: string) {
        const key = new NodeRSA();

        key.setOptions({
            encryptionScheme: "pkcs1",
            signingScheme: "pkcs1-sha256",
        });

        const mod2 = Buffer.from(publickeyMod, "hex");
        const exp2 = Buffer.from(publickeyExp, "hex");

        key.importKey(
            {
                n: mod2,
                e: exp2,
            },
            "components-public"
        );

        return key.encrypt(password, "base64");
    }

    private checkResult(res: UnknownRecord) {
        if (res.EResult !== EResult.OK) {
            throw new SteamClientError(EResultMap.get(res.EResult as ValueOf<typeof EResult>));
        }
    }
}
