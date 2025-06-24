import config from '../../Config';
import * as randtoken from 'rand-token';
import * as jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import {
  IRedisService,
  IRedisServiceId,
} from '@infrastructure/Service/RedisService/IRedisService';
import { IRedisAuthService } from '@infrastructure/Service/RedisAuth/IRedisAuthService';
const { authConfig } = config;

type redisTokenKv = {
  key: string;
  value: string;
};

@injectable()
class RedisAuthService implements IRedisAuthService {
  hash = 'activeSessions';
  forgotPasswordHash = 'forgotPassword';

  /**
   *
   * @param {RedisService} redisService
   */
  constructor(@inject(IRedisServiceId) private redisService: IRedisService) {}

  async refreshTokenExists(refreshToken) {
    const keys = await this.redisService.getAllkeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  async getUserIdFromRefreshToken(refreshToken) {
    const keys = await this.redisService.getAllkeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) {
      return false;
    }

    const key = keys[0];

    return key.substring(key.indexOf(this.hash) + this.hash.length + 1);
  }

  async saveAuthenticatedUser(user) {
    if (user.isLoggedIn()) {
      await this.addToken(user.userId, user.refreshToken, user.accessToken);
    }
  }

  async deAuthenticateUser(userId) {
    await this.clearAllSessions(userId);
  }

  async saveForgotPasswordToken(user, forgotPasswordToken) {
    await this.addForgotPasswordToken(user.userId, forgotPasswordToken);
  }

  createRefreshToken() {
    return randtoken.uid(256);
  }

  /**
   * @function signJWTx
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  signJWT(props, expiryTime = undefined) {
    const claims = {
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      userId: props.userId,
      investorId: props.investor.investorId,
      isEmailVerified: props.isEmailVerified,
      isVerified: props.isVerified,
    };

    return jwt.sign(claims, authConfig.secret, {
      expiresIn: !!expiryTime ? expiryTime : authConfig.tokenExpiryTime,
    });
  }

  /**
   * @method decodeJWT
   * @desc Decodes the JWT using the server secret. If successful decode,
   * it returns the data from the token.
   * @return Promise<any>
   * @param token
   */

  decodeJWT(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return resolve(null);
        return resolve(decoded);
      });
    });
  }

  constructKey(userId, refreshToken) {
    return `refresh-${refreshToken}.${this.hash}.${userId}`;
  }

  constructForgotPasswordTokenKey(userId) {
    return `${this.forgotPasswordHash}.${userId}`;
  }

  /**
   * @method addToken
   * @desc Adds the token for this user to redis.
   *
   * @return Promise<any>
   * @param userId
   * @param refreshToken
   * @param token
   * @param expiry
   */

  async addToken(
    userId,
    refreshToken,
    token,
    expiry = authConfig.refreshTokenExpiryTime,
  ) {
    await this.redisService.set(this.constructKey(userId, refreshToken), token);
    await this.redisService.expire(
      this.constructKey(userId, refreshToken),
      authConfig.refreshTokenExpiryTime,
    );

    return true;
  }

  async addForgotPasswordToken(
    userId,
    token,
    expiry = authConfig.forgotPasswordTokenExpiryTime,
  ) {
    await this.redisService.set(this.constructForgotPasswordTokenKey(userId), token);
    await this.redisService.expire(
      this.constructForgotPasswordTokenKey(userId),
      authConfig.forgotPasswordTokenExpiryTime,
    );

    return true;
  }

  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  async clearAllTokens() {
    const allKeys = await this.redisService.getAllkeys(`*${this.hash}*`);
    return Promise.all(allKeys.map((key) => this.redisService.delete(key)));
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   * @param userId
   */

  countSessions(userId) {
    return this.redisService.count(`*${this.hash}.${userId}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  countTokens() {
    return this.redisService.count(`*${this.hash}*`);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  async getTokens(userId) {
    const keyValues = await this.redisService.getAllKeyValue(`*${this.hash}.${userId}`);
    return keyValues.map((kv: redisTokenKv) => kv.value);
  }

  async getForgotPasswordTokens(userId) {
    const keyValues = await this.redisService.getAllKeyValue(
      `${this.forgotPasswordHash}.${userId}`,
    );
    return keyValues.map((kv: redisTokenKv) => kv.value);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @return Promise<string>
   * @param userId
   * @param refreshToken
   */

  async getToken(userId, refreshToken) {
    return this.redisService.getOne(this.constructKey(userId, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @return Promise<string>
   * @param userId
   * @param refreshToken
   */

  async clearToken(userId, refreshToken) {
    return this.redisService.delete(this.constructKey(userId, refreshToken));
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @return Promise<any>
   * @param userId
   */

  async clearAllSessions(userId) {
    const keyValues = await this.redisService.getAllKeyValue(`*${this.hash}.${userId}`);
    const keys = keyValues.map((kv: redisTokenKv) => kv.key);
    return Promise.all(keys.map((key) => this.redisService.delete(key)));
  }

  async clearPasswordResetTokens(userId) {
    const keyValues = await this.redisService.getAllKeyValue(
      `*${this.forgotPasswordHash}.${userId}`,
    );
    const keys = keyValues.map((kv: redisTokenKv) => kv.key);
    return Promise.all(keys.map((key) => this.redisService.delete(key)));
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @return Promise<boolean>
   * @param userId
   * @param refreshToken
   */

  async sessionExists(userId, refreshToken) {
    const token = await this.getToken(userId, refreshToken);
    if (!!token) {
      return true;
    } else {
      return false;
    }
  }
}

export default RedisAuthService;
