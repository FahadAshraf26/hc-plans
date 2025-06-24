import * as dotenv from 'dotenv';
dotenv.config();

export default {
  secret: process.env.SECRET,
  tokenExpiryTime: 21600, // 14400 seconds => 4 hours
  forgotPasswordTokenExpiryTime: 900, // 900 seconds => 15 minutes
  refreshTokenExpiryTime: 2592000, // 604800 seconds => 1 week
  redisPort: process.env.REDIS_PORT || 6379,
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  rootPassword:process.env.ROOT_PASSWORD
};
