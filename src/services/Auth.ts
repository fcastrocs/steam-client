import QRCode from 'qrcode';
import { UnknownRecord, ValueOf } from 'type-fest';
import SteamCrypto from '@fcastrocs/steam-client-crypto';
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
    QrCode,
    CAuthenticationGetPasswordRSAPublicKeyResponse,
    CAuthenticationBeginAuthSessionViaCredentialsRequest,
    CAuthenticationUpdateAuthSessionWithSteamGuardCodeResponse,
    CAuthenticationAccessTokenGenerateForAppResponse,
    CAuthenticationPollAuthSessionStatusResponse,
    CAuthenticationPollAuthSessionStatusRequest
} from '../../@types/index.js';

const { EResultMap, EResult } = Language;

export default class Auth {
    private waitingForConfirmation: boolean;

    private partialSession: CAuthenticationBeginAuthSessionViaCredentialsResponse | CAuthenticationBeginAuthSessionViaQRResponse;

    private readonly serviceName = 'Authentication';

    private pollStatusInterval: NodeJS.Timeout;

    constructor(private steam: Steam) {
        this.steam.on('disconnected', () => {
            clearInterval(this.pollStatusInterval);
            this.waitingForConfirmation = false;
        });
    }

    /**
     * Obtain auth tokens via QR
     * @emits "waitingForConfirmation" "authTokens"
     * @throws EResult
     */
    public async getAuthTokensViaQR(): Promise<QrCode> {
        if (this.steam.isLoggedIn) throw new SteamClientError('AlreadyLoggedIn');

        // begin login by getting QR challenge URL
        const res: CAuthenticationBeginAuthSessionViaQRResponse = await this.steam.sendServiceMethodCall(
            this.serviceName,
            'BeginAuthSessionViaQR',
            {
                deviceDetails: {
                    deviceFriendlyName: this.steam.rememberedMachine.name,
                    platformType: EAuthTokenPlatformType.SteamClient,
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
        this.pollAuthSessionStatus();

        return genQRCode(res.challengeUrl);
    }

    /**
     * Obtain auth tokens via credentials
     * @emits "authTokens"
     * @throws EResult
     */
    public async getAuthTokensViaCredentials(
        accountName: string,
        password: string,
        options: { skipPollAuthSessionStatus?: boolean } = {}
    ): Promise<CAuthenticationBeginAuthSessionViaCredentialsResponse> {
        if (this.steam.isLoggedIn) throw new SteamClientError('AlreadyLoggedIn');

        const rsa: CAuthenticationGetPasswordRSAPublicKeyResponse = await this.steam.sendServiceMethodCall(
            this.serviceName,
            'GetPasswordRSAPublicKey',
            {
                accountName
            }
        );

        const res: CAuthenticationBeginAuthSessionViaCredentialsResponse = await this.steam.sendServiceMethodCall(
            this.serviceName,
            'BeginAuthSessionViaCredentials',
            {
                accountName,
                encryptedPassword: SteamCrypto.rsaEncrypt(password, rsa.publickeyMod, rsa.publickeyExp),
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

        if (options.skipPollAuthSessionStatus) {
            return res;
        }

        let doPollStatus = false;

        res.allowedConfirmations.forEach((item) => {
            if (item.confirmationType === EAuthSessionGuardType.Unknown) {
                doPollStatus = true;
            }
            if (item.confirmationType === EAuthSessionGuardType.None) {
                doPollStatus = true;
            }
        });

        if (doPollStatus) {
            this.waitingForConfirmation = true;
            this.partialSession = res;
            this.pollAuthSessionStatus();
        }

        return res;
    }

    /**
     * Submit Steam Guard Code to auth session
     * @throws EResult, NotWaitingForConfirmation
     */
    public async updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType) {
        if (!this.waitingForConfirmation) throw new SteamClientError('NotWaitingForConfirmation');

        // submit steam guard code
        const res: CAuthenticationUpdateAuthSessionWithSteamGuardCodeResponse = await this.steam.sendServiceMethodCall(
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
        const res: CAuthenticationAccessTokenGenerateForAppResponse = await this.steam.sendServiceMethodCall(
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
     * @emits "authTokens"
     */
    private pollAuthSessionStatus() {
        // poll auth status until user responds to QR or timeouts
        // currently steam ends connection after a little while of not confirming login
        this.pollStatusInterval = setInterval(async () => {
            let pollStatus: CAuthenticationPollAuthSessionStatusResponse;

            try {
                pollStatus = await this.steam.sendServiceMethodCall(this.serviceName, 'PollAuthSessionStatus', {
                    clientId: this.partialSession.clientId,
                    requestId: this.partialSession.requestId
                } as CAuthenticationPollAuthSessionStatusRequest);
                checkResult(pollStatus);
            } catch (error) {
                clearInterval(this.pollStatusInterval);

                if (error instanceof Error && error.message === 'ServiceMethodCall Response timeout.') {
                    return;
                }

                // unexpected error
                throw error;
            }

            // user confirmed logon
            if (pollStatus.refreshToken || pollStatus.accessToken) {
                this.waitingForConfirmation = false;
                clearInterval(this.pollStatusInterval);
                this.steam.emit('authTokens', pollStatus);
                return;
            }

            // got new qr Code
            if (pollStatus.newChallengeUrl) {
                this.steam.emit('qrCode', await genQRCode(pollStatus.newChallengeUrl));
                this.partialSession.clientId = pollStatus.newClientId;
            }
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
