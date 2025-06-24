import redis from '../../Redis/RedisClient';
import config from '../../Config';
import { IRedisService } from '@infrastructure/Service/RedisService/IRedisService';
import { injectable } from 'inversify';
const { authConfig } = config;

@injectable()
class RedisService implements IRedisService {
  private redisClient;

  start() {
    redis.start();
    this.redisClient = redis.getClient();
  }

  async set(key, data, setExpiry = false, seconds = 0) {
    const setToRedis = await redis.getClient().set(key, data);
    if (setExpiry) {
      await redis.getClient().expire(key, seconds);
    }
    return setToRedis;
  }

  async get(key) {
    return redis.getClient().get(key);
  }

  async delete(key) {
    return redis.getClient().del(key);
  }

  async addSMembers(key, data, setExpiry = false, seconds = 0) {
    const serializedData = this.compressData(data);
    const storeToRedis = await redis.getClient().sadd(key, serializedData);
    if (setExpiry) {
      await redis.getClient().expire(key, seconds);
    }
    return storeToRedis;
  }

  async getSMembers(key) {
    const members = await redis.getClient().smembers(key);
    return members.map((record) => {
      return JSON.parse(record);
    });
  }

  compressData(data) {
    return data.map((record) => {
      return JSON.stringify(record);
    });
  }

  async expire(key, ttl) {
    return redis.getClient().expire(key, ttl);
  }

  async getAllkeys(pattern) {
    return redis.getClient().keys(pattern);
  }

  async count(keys) {
    const allKeys = await this.getAllkeys(keys);
    return allKeys.length;
  }

  async exists(key) {
    const count = await this.count(key);
    return count >= 1;
  }

  async getOne(key) {
    return redis.getClient().get(key);
  }

  // async getAllkeys(wildcard) {
  //   return RedisService.redisClient.keys(wildcard);
  // }

  async getAllKeyValue(wildcard) {
    const results = await redis.getClient().keys(wildcard);
    const response = await Promise.all(
      results.map(async (key) => {
        const value = await this.getOne(key);
        return { key, value };
      }),
    );

    return response;
  }

  async setWithExpiry(key, data, expiryTime = authConfig.tokenExpiryTime) {}

  async testConnection() {
    return redis.getClient().set('test', 'connected');
  }
}

export default RedisService;
