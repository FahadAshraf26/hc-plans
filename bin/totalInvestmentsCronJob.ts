import { Op, col, fn } from 'sequelize';
import models from '@infrastructure/Model';
import Config from '@infrastructure/Config';
import container from '@infrastructure/DIContainer/container';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';

const { CampaignFundModel } = models;
const { slackConfig } = Config;

const slackService = container.get<ISlackService>(ISlackServiceId);

export const publishInvestmentsToSlack = async () => {
  const today = new Date();
  const currentQuarterStart = new Date(
    today.getFullYear(),
    Math.floor(today.getMonth() / 3) * 3,
    1,
  );

  const lastDayConditions = {
    createdAt: {
      [Op.gt]: today.getDate() - 1,
    },
  };

  const currentQuarterConditions = {
    createdAt: {
      [Op.gte]: currentQuarterStart,
      [Op.lte]: today,
    },
  };

  const [dailyInvestments, quarterlyInvestments] = await Promise.all([
    CampaignFundModel.findAll({
      attributes: [
        [fn('ROUND', fn('SUM', col('amount')), 2), 'totalAmount'],
        [fn('COUNT', fn('DISTINCT', col('investorId'))), 'numberOfInvestors'],
      ],
      where: lastDayConditions,
      raw: true,
    }),

    CampaignFundModel.findAll({
      attributes: [
        [fn('ROUND', fn('SUM', col('amount')), 2), 'totalAmount'],
        [fn('COUNT', fn('DISTINCT', col('investorId'))), 'numberOfInvestors'],
      ],
      where: currentQuarterConditions,
      raw: true,
    }),
  ]);

  const dailyTotalAmount = dailyInvestments[0].totalAmount || 0;
  const dailyNumberOfInvestments = dailyInvestments[0].numberOfInvestors;

  const quarterlyTotalAmount = quarterlyInvestments[0].totalAmount || 0;
  const quarterlyNumberOfInvestments = quarterlyInvestments[0].numberOfInvestors;

  await slackService.publishMessage({
    message: `Today's dollars across the platform: ${dailyTotalAmount} $ from ${dailyNumberOfInvestments} investors and quarterly are ${quarterlyTotalAmount} $ from ${quarterlyNumberOfInvestments} investors`,
    slackChannelId: slackConfig.PUBLISH_INVESTMENTS.ID,
  });
};
