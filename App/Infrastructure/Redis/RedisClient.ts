import * as redis from 'redis';
import * as AsyncRedis from 'async-redis';
import log from '../Logger/logger';
import config from '../Config';

const {authConfig} = config;

class RedisClient {
    static client;

    static start() {
        log.debug(`[Redis]: Initializing redis`);
        const client = redis.createClient(authConfig.redisPort, authConfig.redisHost, {});
        this.client = AsyncRedis.decorate(client);
        this.registerListeners(client);
    }

    static registerListeners(client) {
        client.on('connect', () => {
            log.debug(
                `[Redis]: Connected to redis server at ${authConfig.redisHost}:${authConfig.redisPort}`,
            );
        });

        client.on('error', (error) => {
            log.debug(`[Redis]: Can not connect to redis ${error}`);
            process.exit(1);
        });
    }

    static getClient() {
        return this.client;
    }
}

export default RedisClient;
