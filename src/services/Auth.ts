import NodeRSA from 'node-rsa';
import QRCode from 'qrcode';
import EventEmitter from 'events';
import { UnknownRecord, ValueOf } from 'type-fest';
import Steam from '../Steam.js';
import Language from '../modules/language.js';
import { SteamClientError } from '../modules/common.js';
import {
    EAuthSessionGuardType,
    EAuthTokenPlatformType,
    ETokenRenewalType
} from '../../resources/language/steammessages_auth.steamclient.js';
import { EOSType } from '../../resources/language/enums.steamd.js';
import { ESessionPersistence } from '../../resources/language/enums.js';
import type {
    CAuthenticationBeginAuthSessionViaCredentialsResponse,
    CAuthenticationBeginAuthSessionViaQRResponse,
    Confirmation,
    CAuthenticationGetPasswordRSAPublicKeyResponse,
    CAuthenticationBeginAuthSessionViaCredentialsRequest,
    CAuthenticationUpdateAuthSessionWithSteamGuardCodeResponse,
    CAuthenticationAccessTokenGenerateForAppResponse,
    CAuthenticationPollAuthSessionStatusResponse
} from '../../@types/index.js';

const { EResultMap, EResult } = Language;

export default class Auth extends EventEmitter {
    private waitingForConfirmation: boolean;

    private partialSession: CAuthenticationBeginAuthSessionViaCredentialsResponse | CAuthenticationBeginAuthSessionViaQRResponse;

    private readonly serviceName = 'Authentication';

    private readonly timeout = 1 * 60 * 1000;

    constructor(private steam: Steam) {
        super();
    }

    /**
     * Obtain auth tokens via QR
     * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
     * @throws EResult
     */
    public async getAuthTokensViaQR(): Promise<Confirmation> {
        if (this.steam.isLoggedIn) throw new SteamClientError('AlreadyLoggedIn');

        // begin login by getting QR challenge URL
        const res: CAuthenticationBeginAuthSessionViaQRResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'BeginAuthSessionViaQR',
            {
                deviceDetails: {
                    deviceFriendlyName: this.steam.rememberedMachine.name,
                    platformType: EAuthTokenPlatformType.SteamClient, // as unknown as typeof EAuthTokenPlatformType,
                    osType: EOSType.Win11,
                    gamingDeviceType: 1,
                    machineId: this.steam.rememberedMachine.id
                },
                websiteId: 'Unknown'
            }
        );

        checkResult(res);

        this.waitingForConfirmation = true;
        this.partialSession = res;
        this.pollAuthStatusInterval();

        return { qrCode: await genQRCode(res.challengeUrl), timeout: this.timeout };
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
    ): Promise<CAuthenticationBeginAuthSessionViaCredentialsResponse> {
        if (this.steam.isLoggedIn) throw new SteamClientError('AlreadyLoggedIn');

        const rsa: CAuthenticationGetPasswordRSAPublicKeyResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'GetPasswordRSAPublicKey',
            {
                accountName
            }
        );

        const res: CAuthenticationBeginAuthSessionViaCredentialsResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'BeginAuthSessionViaCredentials',
            {
                accountName,
                encryptedPassword: encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
                encryptionTimestamp: rsa.timestamp,
                rememberLogin: true,
                persistence: ESessionPersistence.Persistent,
                websiteId: 'Unknown',
                language: 0,
                deviceDetails: {
                    deviceFriendlyName: this.steam.rememberedMachine.name,
                    platformType: EAuthTokenPlatformType.SteamClient,
                    osType: EOSType.Win11,
                    gamingDeviceType: 1,
                    machineId: this.steam.rememberedMachine.id
                }
            } as CAuthenticationBeginAuthSessionViaCredentialsRequest
        );

        checkResult(res);

        if (options && options.returnResponse) {
            return res;
        }

        // confirmation type without auth tokens
        res.allowedConfirmations.forEach((item) => {
            if (item.confirmationType === EAuthSessionGuardType.Unknown) {
                throw new SteamClientError('SteamGuardIsUnknown');
            }
            if (item.confirmationType === EAuthSessionGuardType.None) {
                throw new SteamClientError('SteamGuardIsDisabled');
            }
        });

        this.waitingForConfirmation = true;
        this.partialSession = res;
        this.pollAuthStatusInterval();

        this.emit('waitingForConfirmation', {
            allowedConfirmations: res.allowedConfirmations,
            timeout: this.timeout
        } as Confirmation);

        return null;
    }

    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    public async updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType) {
        if (!this.waitingForConfirmation) throw new SteamClientError('NotWaitingForConfirmation');

        // submit steam guard code
        const res: CAuthenticationUpdateAuthSessionWithSteamGuardCodeResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'UpdateAuthSessionWithSteamGuardCode',
            {
                clientId: this.partialSession.clientId,
                steamid: (this.partialSession as CAuthenticationBeginAuthSessionViaCredentialsResponse).steamid,
                code: guardCode,
                codeType: guardType as unknown as number
            }
        );

        checkResult(res);
    }

    public async accessTokenGenerateForApp(refreshToken: string) {
        const res: CAuthenticationAccessTokenGenerateForAppResponse = await this.steam.conn.sendServiceMethodCall(
            this.serviceName,
            'AccessToken_GenerateForApp',
            {
                refreshToken,
                steamid: this.steam.steamId,
                renewalType: ETokenRenewalType.None
            }
        );

        checkResult(res);
        return res;
    }

    /**
     * Poll auth session for auth tokens
     * @emits "authTokens" "getAuthTokensTimeout"
     */
    private pollAuthStatusInterval() {
        let intervalId: NodeJS.Timeout;

        // timeout if did not respond to login attempt
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            this.emit('getAuthTokensTimeout');
        }, this.timeout);

        // poll auth status until user responds to QR or timeouts
        intervalId = setInterval(async () => {
            const pollStatus: CAuthenticationPollAuthSessionStatusResponse = await this.steam.conn.sendServiceMethodCall(
                this.serviceName,
                'PollAuthSessionStatus',
                {
                    clientId: this.partialSession.clientId,
                    requestId: this.partialSession.requestId
                }
            );

            checkResult(pollStatus);

            // got new qr Code
            if (pollStatus.newChallengeUrl) {
                const qrCode = await genQRCode(pollStatus.newChallengeUrl);

                this.emit('waitingForConfirmation', {
                    qrCode
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

            this.emit('authTokens', pollStatus);
        }, this.partialSession.interval * 1000);
    }
}

async function genQRCode(challengeUrl: string) {
    return {
        image: await QRCode.toDataURL(challengeUrl, { type: 'image/webp' }),
        terminal: await QRCode.toString(challengeUrl, {
            type: 'terminal',
            small: true,
            errorCorrectionLevel: 'H'
        })
    };
}

function checkResult(res: UnknownRecord) {
    if (res.EResult !== EResult.OK) {
        throw new SteamClientError(EResultMap.get(res.EResult as ValueOf<typeof EResult>));
    }
}

function encryptPass(password: string, publickeyMod: string, publickeyExp: string) {
    const key = new NodeRSA();

    key.setOptions({
        encryptionScheme: 'pkcs1',
        signingScheme: 'pkcs1-sha256'
    });

    const mod2 = Buffer.from(publickeyMod, 'hex');
    const exp2 = Buffer.from(publickeyExp, 'hex');

    key.importKey(
        {
            n: mod2,
            e: exp2
        },
        'components-public'
    );

    return key.encrypt(password, 'base64');
}
