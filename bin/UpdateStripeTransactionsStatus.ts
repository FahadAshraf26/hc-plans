import dotenv from 'dotenv';
dotenv.config();
import models from '@infrastructure/Model';
import async from 'async';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import container from '@infrastructure/DIContainer/container';
import logger from '@infrastructure/Logger/logger';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';

const { Sequelize, sequelize } = models;

const stripeService = container.get<IStripeService>(IStripeServiceId);

export const UpdateStripeTransactionsStatus = async () => {
  const query = `SELECT  * FROM campaignFunds cf JOIN hybridTransactions hc ON hc.campaignFundId = cf.campaignFundId JOIN campaigns c ON c.campaignId = cf.campaignId WHERE hc.source = 'stripe' AND c.escrowType = 'ThreadBank' AND hc.status = 'pending' ORDER BY c.createdAt DESC;`;
  const response = await sequelize.query(query, {
    type: Sequelize.QueryTypes.SELECT,
  });
  let counter = 0;
  const incompleteStripeTransactions = [];

  await async.eachSeries(response, async (item) => {
    try {
      counter++;
      console.log(counter, response.length);
      const stripeResponse = await stripeService.getTransactionStatus(item.tradeId);
      if (stripeResponse === 'succeeded') {
        console.log('SSSSSSS', item.tradeId);
        const updateHybridTransactionQuery = `update hybridTransactions set status = "success" where tradeId = "${item.tradeId}"`;
        await sequelize.query(updateHybridTransactionQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });

        const updateChargeQuery = `update charges set chargeStatus = "success" where chargeId = "${item.chargeId}"`;
        await sequelize.query(updateChargeQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });
      } else {
        incompleteStripeTransactions.push(item.tradeId);
        console.log('#######', item.tradeId, stripeResponse);
      }
    } catch (e) {
      console.log(e);
    }
  });

  console.log(incompleteStripeTransactions);
  return incompleteStripeTransactions;
};
