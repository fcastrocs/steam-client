import NodeRSA from "node-rsa";
import QRCode from "qrcode";
import Steam from "../Steam.js";
import { Language } from "../modules/language.js";
import { SteamClientError } from "../modules/common.js";
import { EAuthSessionGuardType, EAuthTokenPlatformType, ETokenRenewalType } from "../language/steammessages_auth.steamclient.proto.js";
import { EResult } from "../language/EResult.js";
import EventEmitter from "events";
import {
  AccessToken_GenerateForApp_Request,
  AccessToken_GenerateForApp_Response,
  BeginAuthSessionViaCredentials_Request,
  BeginAuthSessionViaCredentials_Response,
  BeginAuthSessionViaQR_Request,
  BeginAuthSessionViaQR_Response,
  Confirmation,
  GetPasswordRSAPublicKey_Request,
  GetPasswordRSAPublicKey_Response,
  PollAuthSessionStatus_Request,
  PollAuthSessionStatus_Response,
  UpdateAuthSessionWithSteamGuardCode_Request,
  UpdateAuthSessionWithSteamGuardCode_Response
} from "../../@types/protos/auth.protos.js";
import { ESessionPersistence } from "../language/enums.proto.js";
import { EOSType } from "../language/commons.js";

export default class Auth extends EventEmitter {
  private waitingForConfirmation!: boolean;
  private partialSession!: BeginAuthSessionViaCredentials_Response | BeginAuthSessionViaQR_Response;
  private readonly serviceName = "Authentication";
  private readonly timeout = 1 * 60 * 1000;
  constructor(private steam: Steam) { super() }

  /**
   * Obtain auth tokens via QR
   * @emits "waitingForConfirmation" "authTokens" "getAuthTokensTimeout"
   * @throws EResult
   */
  public async getAuthTokensViaQR() {
    if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

    // begin login by getting QR challenge URL
    const res = (await this.steam.conn.sendServiceMethodCall(this.serviceName, "BeginAuthSessionViaQR", {
      deviceDetails: {
        deviceFriendlyName: this.steam.machineName,
        platformType: EAuthTokenPlatformType.SteamClient,
        osType: EOSType.Win11,
        gamingDeviceType: 1,
        machineId: this.steam.machineId
      },
      websiteId: "Unknown",
    } as BeginAuthSessionViaQR_Request)) as BeginAuthSessionViaQR_Response;

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
  public async getAuthTokensViaCredentials(accountName: string, password: string) {
    if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

    const rsa = (await this.steam.conn.sendServiceMethodCall(this.serviceName, "GetPasswordRSAPublicKey", {
      accountName
    } as GetPasswordRSAPublicKey_Request)) as GetPasswordRSAPublicKey_Response;

    const res = (await this.steam.conn.sendServiceMethodCall(
      this.serviceName,
      "BeginAuthSessionViaCredentials",
      {
        deviceFriendlyName: this.steam.machineName,
        accountName,
        encryptedPassword: this.encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
        encryptionTimestamp: rsa.timestamp,
        platformType: EAuthTokenPlatformType.SteamClient,
        persistence: ESessionPersistence.Persistent,
        websiteId: "Client",
      } as BeginAuthSessionViaCredentials_Request
    )) as BeginAuthSessionViaCredentials_Response;

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
    } as Confirmation);
  }

  /**
   * Submit Steam Guard Code to auth session
   * @throws EResult, NotWaitingForConfirmation
   */
  public async updateWithSteamGuardCode(guardCode: string, guardType: typeof EAuthSessionGuardType) {
    if (!this.waitingForConfirmation) throw new SteamClientError("NotWaitingForConfirmation");

    // submit steam guard code
    const res = await (this.steam.conn.sendServiceMethodCall(this.serviceName, "UpdateAuthSessionWithSteamGuardCode", {
      clientId: this.partialSession.clientId,
      steamid: (this.partialSession as BeginAuthSessionViaCredentials_Response).steamid,
      code: guardCode,
      codeType: guardType as unknown as number,
    } as UpdateAuthSessionWithSteamGuardCode_Request)) as UpdateAuthSessionWithSteamGuardCode_Response;

    this.checkResult(res);
  }

  public async accessTokenGenerateForApp(refreshToken: string) {
    const res = await this.steam.conn.sendServiceMethodCall(this.serviceName,
      "AccessToken_GenerateForApp", {
        refreshToken,
        steamid: this.steam.steamId,
        renewalType: ETokenRenewalType.None
      } as AccessToken_GenerateForApp_Request) as AccessToken_GenerateForApp_Response;

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
      this.emit("getAuthTokensTimeout")
    }, this.timeout);

    // poll auth status until user responds to QR or timeouts
    const intervalId = setInterval(async () => {

      const pollStatus = await this.steam.conn.sendServiceMethodCall(
        this.serviceName,
        "PollAuthSessionStatus",
        {
          clientId: this.partialSession.clientId,
          requestId: this.partialSession.requestId,
        } as PollAuthSessionStatus_Request
      ) as PollAuthSessionStatus_Response;

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

      this.emit("authTokens", pollStatus)

    }, this.partialSession.interval * 1000);

  }

  private async genQRCode(challengeUrl: string) {
    return {
      terminal: await QRCode.toString(challengeUrl, { type: "terminal", small: true, errorCorrectionLevel: "H" }),
      image: await QRCode.toDataURL(challengeUrl, { type: "image/webp" })
    }
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

  private checkResult(res: { EResult: number }) {
    if (res.EResult !== EResult.OK) {
      throw new SteamClientError(Language.EResultMap.get(res.EResult)!);
    }
  }
}
