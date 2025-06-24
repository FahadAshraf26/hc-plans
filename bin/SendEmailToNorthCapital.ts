import logger from '@infrastructure/Logger/logger';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import models from '@infrastructure/Model';
import mailService from '@infrastructure/Service/MailService';
import moment from 'moment';
import container from '@infrastructure/DIContainer/container';
import NorthCapitalDocument from '@domain/Core/NorthCapitalDocument/NorthCapitalDocument';
import {
  INorthCapitalDocumentRepository,
  INorthCapitalDocumentRepositoryId,
} from '@domain/Core/NorthCapitalDocument/INorthCapitalDocumentRepository';
import EmailTemplates from '@domain/Utils/EmailTemplates';
import Config from '@infrastructure/Config';
import async from 'async';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import slack from '@infrastructure/Config/slack';

const storageService = container.get<IStorageService>(IStorageServiceId);
const slackService = container.get<ISlackService>(ISlackServiceId);
const northCapitalDocumentRepository = container.get<INorthCapitalDocumentRepository>(
  INorthCapitalDocumentRepositoryId,
);

const { SendHtmlEmail } = mailService;
const { Sequelize, sequelize } = models;
const { honeycombTradesTemplate } = EmailTemplates;
const { emailConfig } = Config;
const email = emailConfig;

export const SendEmailToNorthCapital = async () => {
  try {
    const query = `select tradeId, individualACHId from hybridTransactions where (transactionType = 'WALLET' or transactionType = 'HYBRID') and individualACHId is not null and status = 'pending' and isSent= 0 and source = 'NCBank'`;
    const response = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    if (response.length) {
      const fileName = `dwolla-transaction-records-${moment().format(
        'YYYY-DD-MMTHH:mm:ss',
      )}.csv`;
      fs.writeFileSync(fileName, 'Individual ACH ID,Trade ID\n', { flag: 'a+' });
      response.map((item) => {
        fs.writeFileSync(fileName, `${item.individualACHId},${item.tradeId}\n`, {
          flag: 'a+',
        });
      });
      const filepath = `uploads/northCapitalTransactions/${fileName}`;
      const csvFileStream = path.resolve(`${fileName}`);
      await storageService.uploadPdfFile(csvFileStream, filepath);

      const ncTransaction = NorthCapitalDocument.createFromDetail(
        'Wallet-Transactions',
        fileName,
        filepath,
        'application/txt',
        'csv',
      );

      northCapitalDocumentRepository.add(ncTransaction);
      async.eachSeries(response, async (item) => {
        await sequelize.query(
          `UPDATE 
            hybridTransactions
          SET
            isSent = 1
          WHERE
            tradeId = '${item.tradeId}'`,
          {
            type: Sequelize.QueryTypes.UPDATE,
          },
        );
      });
      await SendHtmlEmail(
        email.NORTH_CAPITAL_EMAIL,
        'Honeycomb Credit trades from Dwolla Wallets',
        honeycombTradesTemplate,
        [{ fileName, content: fs.createReadStream(csvFileStream) }],
        false,
        [
          'fahad.ashraf@carbonteq.com',
          'joe@honeycombcredit.com',
          'christian@honeycombcredit.com',
        ],
      );

      fs.unlink(csvFileStream, (err) => {
        logger.error(err);
      });
    }
  } catch (error) {
    await slackService.publishMessage({
      message: `Cron Job Error: ${error}`,
      slackChannelId: slack.ERROS.ID,
    });
    throw new Error(error);
  }
};
