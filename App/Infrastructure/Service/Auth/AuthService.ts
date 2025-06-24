import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import config from '../../Config';
import { TokenType } from '../../../Domain/Core/ValueObjects/TokenType';
import { injectable } from 'inversify';
import { IAuthService } from './IAuthService';

const { server } = config;
const { hash: generatePassword, compare: comparePassword } = bcrypt;

@injectable()
class AuthService implements IAuthService {
  async hashPassword(password) {
    return await generatePassword(password, 11);
  }

  async verifyPassword(password, encryptedPassword) {
    return await comparePassword(password, encryptedPassword);
  }

  async authToken(userId, expiresIn = undefined) {
    const options = expiresIn ? { expiresIn } : {};
    return await jwt.sign({ userId, type: TokenType.auth }, server.SECRET, options);
  }

  async adminAuthToken(adminUserId, expiresIn = undefined) {
    const options = expiresIn ? { expiresIn } : {};
    return await jwt.sign({ adminUserId, type: TokenType.auth }, server.SECRET, options);
  }

  async forgetPasswordToken(userId, expiresIn) {
    return await jwt.sign({ userId, type: TokenType.forgotPassword }, server.SECRET, {
      expiresIn,
    });
  }

  async setPasswordToken(userId) {
    const token = jwt.sign({ userId, type: TokenType.SET_NEW_PASSWORD }, server.SECRET);

    return token;
  }

  async emailVerificationToken(userId, expiresIn = undefined, emailId = undefined) {
    const options = expiresIn ? { expiresIn } : {};
    return await jwt.sign(
      { userId, emailId, type: TokenType.EMAIL_VERIFICATION },
      server.SECRET,
      options,
    );
  }

  async reactivateUserToken(userId, expiresIn = undefined) {
    const options = expiresIn ? { expiresIn } : {};
    return await jwt.sign(
      { userId, type: TokenType.REACTIVATE_USER },
      server.SECRET,
      options,
    );
  }

  async verifyToken(token) {
    try {
      return await jwt.verify(token, server.SECRET);
    } catch (e) {
      return e;
    }
  }
}

export default AuthService;
