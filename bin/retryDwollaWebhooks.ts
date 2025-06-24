import dotenv from 'dotenv';
dotenv.config();
import program from 'commander';
import logger from '../App/Infrastructure/Logger/logger';
import container from '@infrastructure/DIContainer/container';
import {
  IWebhookService,
  IWebhookServiceId,
} from '@application/Webhooks/IWebhookService';

const webhookService = container.get<IWebhookService>(IWebhookServiceId);

program
  .command('retry-dwolla-webhooks')
  .option('-d,--date <string>', 'Format: YYYY-MM-DD;date to begin gettings events from')
  .option('-r,--reProcess', 'whether to process all events again or not', false)
  .alias('retryDwolla')
  .description('retry dwolla webhooks that were missed')
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      const date = !!cmd.date ? new Date(cmd.date) : new Date();
      const reProcess = !!cmd.reProcess;
      logger.debug('start job');
      await webhookService.retryDwollaWebhooks(date, reProcess);
      logger.debug('end job');
      return;
    } catch (err) {
      logger.log(err);
      throw err;
    } finally {
      await connection.close();
    }
  });

program.parse(process.argv);
