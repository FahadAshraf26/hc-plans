import dotenv from 'dotenv';
dotenv.config();
import program from 'commander';
import CampaignRiskService from '../App/Application/CampaignRisk/CampaignRiskService';
import logger from '../App/Infrastructure/Logger/logger';
import container from '../App/Infrastructure/DIContainer/container';

const campaignRiskService = container.get<CampaignRiskService>(CampaignRiskService)

program
  .command('recreate-campaign-risks')
  .alias('rcs')
  .option('-c,--campaign <string>', 'campaignId to recreate risks for')
  .description('delete all campaign general risks and then creates them again')
  .action(async (cmd) => {
    const connection = require('../App/Infrastructure/Database/mysqlConnection');
    try {
      logger.debug('start job');
      const campaignId = cmd.campaign;
      await campaignRiskService.recreateRisks(campaignId);
      logger.debug('end job');
      return;
    } catch (err) {
      logger.info(err);
      throw err;
    } finally {
      await connection.close();
    }
  });

program.parse(process.argv);
