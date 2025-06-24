import AdminUserRepository from '@infrastructure/MySQLRepository/AdminUserRepository';
import { TokenType } from '@domain/Core/ValueObjects/TokenType';
import container from '@infrastructure/DIContainer/container';
import {
  IRedisAuthService,
  IRedisAuthServiceId,
} from '@infrastructure/Service/RedisAuth/IRedisAuthService';

const adminUserRepository = container.get<AdminUserRepository>(AdminUserRepository);
const redisAuthService = container.get<IRedisAuthService>(IRedisAuthServiceId);

const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const decoded = await redisAuthService.decodeJWT(token);
    const signatureFailed = !!decoded === false;

    if (signatureFailed) {
      throw Error('signatureFailed');
    }

    if (decoded.type === TokenType.forgotPassword) {
      req.decoded = decoded;
      return next();
    }
    if (decoded.type === TokenType.SET_NEW_PASSWORD) {
      req.decoded = decoded;
      return next();
    }

    if (decoded.type === TokenType.SET_NEW_PASSWORD) {
      req.decoded = decoded;
      return next();
    }

    if (decoded.userId) {
      if (req.params.userId && req.params.userId !== decoded.userId) {
        throw Error('Invalid Resource');
      }

      const tokens = await redisAuthService.getTokens(decoded.userId);
      if (tokens.length === 0) {
        throw Error();
      }
      req.decoded = decoded;

      return next();
    }
    if (decoded.adminUserId) {
      const adminUser = await adminUserRepository.fetchById(decoded.adminUserId);

      if (!adminUser) {
        throw new Error();
      }

      req.adminUser = adminUser;
      return next();
    }
  } catch (e) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

export default auth;
