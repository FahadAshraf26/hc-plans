import AuthService from '../../Application/Auth/AuthService';
import AuthLogInDTO from '../../Application/Auth/AuthLogInDTO';
import ForgetPasswordDTO from '../../Application/Auth/ForgetPasswordDTO';
import AdminLoginDTO from '../../Application/Auth/adminLogin/AdminLoginDTO';
import FacebookLoginDTO from '../../Application/Auth/authFacebook/FacebookLoginDTO';
import GoogleLoginDTO from '../../Application/Auth/authGoogle/GoogleLoginDTO';
import AppleLoginDTO from '../../Application/Auth/authApple/AppleLoginDTO';
import VerifyEmailDTO from '../../Application/Auth/verifyEmail/VerifyEmailDTO';
import InitiateEmailVerificationDTO from '../../Application/Auth/InitiateEmailVerificationDTO';
import ReactivateUserDTO from '../../Application/Auth/reactivateUser/ReactivateUserDTO';
import LogoutDTO from '../../Application/Auth/LogoutDTO';
import RefreshTokenDTO from '../../Application/Auth/RefreshTokenDTO';
import { injectable } from 'inversify';
import AdminLoginUseCase from '../../Application/Auth/adminLogin/AdminLoginUseCase';
import FacebookLoginUseCase from '../../Application/Auth/authFacebook/FacebookLoginUseCase';
import GoogleLoginUseCase from '@application/Auth/authGoogle/GoogleLoginUseCase';
import AppleLoginUseCase from '@application/Auth/authApple/AppleLoginUseCase';
import VerifyEmailUseCase from '@application/Auth/verifyEmail/VerifyEmailUseCase';
import ReactivateUserUseCase from '@application/Auth/reactivateUser/ReactivateUserAuthUseCase';
import InstagramLoginDTO from '@application/Auth/authInstagram/InstagramLoginDTO';
import InstagramLoginUseCase from '@application/Auth/authInstagram/InstagramLoginUseCase';
import InitiateBiometricVerificationDTO from '@application/Auth/InitiateBiometricVerificationDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class AuthController {
  constructor(
    private authService: AuthService,
    private adminLoginUseCase: AdminLoginUseCase,
    private facebookLoginUseCase: FacebookLoginUseCase,
    private googleLoginUseCase: GoogleLoginUseCase,
    private appleLoginUseCase: AppleLoginUseCase,
    private verifyEmailUseCase: VerifyEmailUseCase,
    private reactivateUserUseCase: ReactivateUserUseCase,
    private instagrmLoginUseCase: InstagramLoginUseCase,
  ) {}

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  login = async (httpRequest) => {
    const { email, password, platform } = httpRequest.body;
    const userLoginDTO = new AuthLogInDTO(
      email,
      password,
      httpRequest.headers['x-recaptcha-token'],
      platform,
    );
    const result = await this.authService.logIn(userLoginDTO);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  logout = async (httpRequest) => {
    const { userId } = httpRequest.decoded;
    const input = new LogoutDTO(userId);
    await this.authService.logout(input);

    return {
      body: {
        status: 'success',
        message: 'user logged out successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  refreshToken = async (httpRequest) => {
    const { refreshToken } = httpRequest.body;
    const input = new RefreshTokenDTO(refreshToken);

    const accesstoken = await this.authService.refreshToken(input);
    return {
      body: {
        status: 'success',
        data: {
          token: accesstoken,
          refreshToken,
        },
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  adminLogin = async (httpRequest) => {
    const { email, password } = httpRequest.body;
    const input = new AdminLoginDTO(email, password);
    const adminUser = await this.adminLoginUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data: adminUser,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  forgetPassword = async (httpRequest) => {
    const { email, platform } = httpRequest.body;
    const forgetPasswordDTO = new ForgetPasswordDTO(
      email,
      httpRequest.headers['x-recaptcha-token'],
      platform,
    );
    await this.authService.forgetPassword(forgetPasswordDTO);

    return {
      body: {
        status: 'success',
        message: 'Password reset email sent',
      },
    };
  };
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */

  verifyResetPasswordToken = async ({ body: { token } }) => {
    const forgetPasswordToken = await this.authService.verifyResetPasswordToken(token);
    return {
      body: {
        status: 'success',
        data: { token: forgetPasswordToken },
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  authFacebook = async (httpRequest) => {
    const { token } = httpRequest.body;

    const input = new FacebookLoginDTO(token);
    const data = await this.facebookLoginUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  authGoogle = async (httpRequest) => {
    const { token } = httpRequest.body;

    const input = new GoogleLoginDTO(token);
    const data = await this.googleLoginUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  authApple = async (httpRequest) => {
    const { token } = httpRequest.body;

    const input = new AppleLoginDTO(token);
    const data = await this.appleLoginUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  /**
   * @returns {Promise<HttpResponse>}
   * @param _
   * @param res
   */
  resetPassword = async (_, res) => {
    const html = await this.authService.resetPassword();

    return {
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    };
  };

  setNewPassword = async (_, res) => {
    const html = await this.authService.setNewPassword();

    return {
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    };
  };

  verifyEmail = async (httpRequest) => {
    const { token } = httpRequest.query;

    const input = new VerifyEmailDTO(token);
    const html = await this.verifyEmailUseCase.execute(input);
    return {
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  initiateEmailVerification = async (httpRequest) => {
    const { userId } = httpRequest;

    const input = new InitiateEmailVerificationDTO(userId);
    await this.authService.initiateEmailVerification(input);

    return {
      body: {
        status: 'success',
        message: 'Verification Email Sent Successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  initiateBiometricVerification = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { biometricSignatureKey } = httpRequest.body;
    const input = new InitiateBiometricVerificationDTO(userId, biometricSignatureKey);
    const result = await this.authService.initiateBiometricVerification(input);

    return {
      body: {
        status: 'success',
        data: result,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  reactivateUser = async (httpRequest) => {
    const { activationToken } = httpRequest.body;

    const input = new ReactivateUserDTO(activationToken);
    await this.reactivateUserUseCase.execute(input);

    return {
      body: {
        status: 'success',
        message: 'User Activated Successfully!',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  authInstagram = async (httpRequest) => {
    const { userName } = httpRequest.body;

    const input = new InstagramLoginDTO(userName);
    const data = await this.instagrmLoginUseCase.execute(input);

    return {
      body: {
        status: 'success',
        data,
      },
    };
  };
}

export default AuthController;
