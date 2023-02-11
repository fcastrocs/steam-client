import NodeRSA from "node-rsa";
import QRCode from "qrcode";
import Steam from "../Steam.js";
import { Language } from "../resources.js";
import IAuth, {
  SessionViaCredentialsRes,
  AuthTokens,
  SessionViaQrRes,
  UnifiedMsgRes,
  PollAuthSessionStatusRes,
  Confirmation,
  QRType,
  PartialSession,
} from "../../@types/services/auth.js";
import { SteamClientError } from "../common.js";
const EAuthSessionGuardType = Language.EAuthSessionGuardType;

export default class Auth {
  private waitingForConfirmation = false;
  private partialSession: PartialSession;
  private readonly serviceName = "Authentication";
  private qrType: QRType;
  private readonly LogonWasNotConfirmedSeconds = 120;
  constructor(private steam: Steam) {}

  /**
   * Login via QR
   * @emits "waitingForConfirmation" with QR challenge URL
   * @throws "LogonWasNotConfirmed"
   */
  public async getAuthTokensViaQR(qrType: QRType): Promise<AuthTokens> {
    if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

    this.qrType = qrType;

    // begin login by getting QR challenge URL
    const res: SessionViaQrRes = await this.steam.sendUnified(this.serviceName, "BeginAuthSessionViaQR", {
      deviceFriendlyName: this.steam.machineName,
      platformType: 1, // steam client
    });

    this.checkResult(res);

    const qrCode = await this.genQRCode(res.challengeUrl);

    this.steam.emit("waitingForConfirmation", {
      qrCode,
      timeoutSeconds: this.LogonWasNotConfirmedSeconds,
    } as Confirmation);

    this.waitingForConfirmation = true;
    this.partialSession = res;

    // poll auth status until user responds to QR or timeouts
    return this.pollAuthStatusInterval();
  }

  /**
   * Login via Credentials
   * @emits "waitingForConfirmation" with confirmation type
   * @throws EResult, SteamGuardIsUnknown, SteamGuardIsDisabled
   */
  public async getAuthTokensViaCredentials(accountName: string, password: string): Promise<AuthTokens> {
    if (this.steam.isLoggedIn) throw new SteamClientError("AlreadyLoggedIn");

    const rsa = await this.steam.sendUnified(this.serviceName, "GetPasswordRSAPublicKey", { accountName });

    const res: SessionViaCredentialsRes = await this.steam.sendUnified(
      this.serviceName,
      "BeginAuthSessionViaCredentials",
      {
        deviceFriendlyName: this.steam.machineName,
        accountName,
        encryptedPassword: this.encryptPass(password, rsa.publickeyMod, rsa.publickeyExp),
        encryptionTimestamp: rsa.timestamp,
        platformType: 1, // steam client
        persistence: 1,
        websiteId: "Client",
      }
    );

    this.checkResult(res);

    const allowedConfirmations = res.allowedConfirmations.map((confirmation) => confirmation.confirmationType);

    if (allowedConfirmations.includes(EAuthSessionGuardType.unknown)) {
      throw new SteamClientError("SteamGuardIsUnknown");
    }

    if (allowedConfirmations.includes(EAuthSessionGuardType.none)) {
      throw new SteamClientError("SteamGuardIsDisabled");
    }

    let guardType: number;

    if (allowedConfirmations.includes(EAuthSessionGuardType.machineToken)) {
      guardType = EAuthSessionGuardType.machineToken;
    }
    // device confirmation. It seems like when deviceCode confirmation is present,
    // we can also use deviceConfirmation instead
    else if (
      allowedConfirmations.includes(EAuthSessionGuardType.deviceConfirmation) ||
      allowedConfirmations.includes(EAuthSessionGuardType.deviceCode)
    ) {
      guardType = EAuthSessionGuardType.deviceConfirmation;
      // never seen this confirmation type
    } else if (allowedConfirmations.includes(EAuthSessionGuardType.emailConfirmation)) {
      guardType = EAuthSessionGuardType.emailConfirmation;
      // email code
    } else if (allowedConfirmations.includes(EAuthSessionGuardType.emailCode)) {
      guardType = EAuthSessionGuardType.emailCode;
    }

    this.steam.emit("waitingForConfirmation", {
      guardType: Language.EAuthSessionGuardTypeMap.get(guardType),
      timeoutSeconds: this.LogonWasNotConfirmedSeconds,
    } as Confirmation);

    this.waitingForConfirmation = true;
    this.partialSession = res;

    return this.pollAuthStatusInterval();
  }

  /**
   * Submit Steam Guard Code to auth session
   * @throws EResult
   */
  public async updateWithSteamGuardCode(code: string, guardType: keyof typeof EAuthSessionGuardType) {
    if (!this.waitingForConfirmation) throw new SteamClientError("NotWaitingForConfirmation");

    // submit steam guard code
    const res: UnifiedMsgRes = await this.steam.sendUnified(this.serviceName, "UpdateAuthSessionWithSteamGuardCode", {
      clientId: this.partialSession.clientId,
      steamid: (this.partialSession as SessionViaCredentialsRes).steamid,
      code,
      codeType: EAuthSessionGuardType[guardType],
    });

    this.checkResult(res);
  }

  /**
   * Poll auth session for auth tokens
   * Will stop after one minute of polling
   * @throws "LogonWasNotConfirmed"
   */
  private pollAuthStatusInterval(): Promise<AuthTokens> {
    return new Promise((resolve, reject) => {
      // clear interval after one minute, and fail login
      const timeout = setTimeout(() => {
        clearInterval(interval);
        reject(new SteamClientError("LogonWasNotConfirmed"));
      }, this.LogonWasNotConfirmedSeconds * 1000);

      // poll auth status until user responds to QR or timeouts
      const interval = setInterval(async () => {
        const pollStatus: PollAuthSessionStatusRes = await this.steam.sendUnified(
          this.serviceName,
          "PollAuthSessionStatus",
          {
            clientId: this.partialSession.clientId,
            requestId: this.partialSession.requestId,
          }
        );

        this.checkResult(pollStatus);

        // got new challenge
        if (pollStatus.newChallengeUrl) {
          const qrCode = await this.genQRCode(pollStatus.newChallengeUrl);
          this.steam.emit("waitingForConfirmation", {
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
        clearInterval(interval);
        clearTimeout(timeout);

        // emit authtokens
        resolve({
          accountName: pollStatus.accountName,
          refreshToken: pollStatus.refreshToken,
          accessToken: pollStatus.accessToken,
          machineName: this.steam.machineName,
          newGuardData: pollStatus.newGuardData,
        });
      }, 5 * 1000);
    });
  }

  private async genQRCode(challengeUrl: string) {
    let code;
    if (this.qrType === "terminal") {
      code = await QRCode.toString(challengeUrl, { type: "terminal", small: true, errorCorrectionLevel: "H" });
    } else if (this.qrType === "image") {
      code = await QRCode.toDataURL(challengeUrl, { type: "image/webp" });
    }
    return code;
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

  private checkResult(res: UnifiedMsgRes) {
    if (res.EResult !== Language.EResult.OK) {
      throw new SteamClientError(Language.EResultMap.get(res.EResult));
    }
  }
}
