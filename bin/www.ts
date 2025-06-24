import dotenv from 'dotenv';
dotenv.config();
import '@infrastructure/Database/mysqlConnection';
import config from '@infrastructure/Config';
import program from 'commander';
import app from '../App/HTTP/Server';
import logger from '@infrastructure/Logger/logger';
import container from '@infrastructure/DIContainer/container';
// const http = require('http').Server(app);
// http.keepAliveTimeout = 0;

import {
  IRedisService,
  IRedisServiceId,
} from '@infrastructure/Service/RedisService/IRedisService';
import {
  IInMemoryAsyncEventBus,
  IInMemoryAsyncEventBusId,
} from '@infrastructure/EventBus/InMemory/IInMemoryAsyncEventBus';

const redisService = container.get<IRedisService>(IRedisServiceId);
const eventBus = container.get<IInMemoryAsyncEventBus>(IInMemoryAsyncEventBusId);
const { server } = config;

// if (server.IS_PRODUCTION) {
// }

program.command('start').action(() => {
  eventBus.start();
  redisService.start();

  const httpServer = app.listen(server.PORT, '0.0.0.0', () => {
    logger.info(`[HTTP]: ${server.APP_NAME} Listening on port ${server.PORT} `);
  });

  httpServer.keepAliveTimeout = 61 * 1000;
  httpServer.headersTimeout = 65 * 1000;
});

program.parse(process.argv);
