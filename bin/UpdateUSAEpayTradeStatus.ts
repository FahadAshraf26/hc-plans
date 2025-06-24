import dotenv from 'dotenv';
dotenv.config();
import models from '@infrastructure/Model';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import async from 'async';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import container from '@infrastructure/DIContainer/container';
import logger from '@infrastructure/Logger/logger';

const { Sequelize, sequelize } = models;
enum RESULT_CODE {
  ERROR = 'E',
  DECLINED = 'D',
  VERIFICATION_REQUIRED = 'V',
  PARTIAL_APPROVED = 'P',
  APPROVED = 'A',
}

const dwollaService = container.get<IDwollaService>(IDwollaServiceId);

export const UpdateUSAEPayTradeStatus = async () => {
  try {
    const query = `select hybridTransactionId,tradeId,dwollaTransactionId,campaignFundId, transactionType,source from hybridTransactions hc where hc.status = "pending" and (hc.source = 'FirstCitizenBank' || hc.source = 'ThreadBank')`;
    const response = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    let counter = 0;
    const totalRecords = response.length;
    let tradeStatus = ChargeStatus.PENDING;
    let status = ChargeStatus.PENDING;

    return async.eachSeries(response, async (item) => {
      try {
        counter++;
        if (
          item.transactionType === TransactionType.ACH().getValue() ||
          item.transactionType === TransactionType.Hybrid().getValue()
        ) {
          const data = await usaepayService.fetchTransactionDetail(
            item.tradeId,
            item.source,
          );

          switch (data.result_code) {
            case RESULT_CODE.ERROR:
              status = ChargeStatus.FAILED;
              break;
            case RESULT_CODE.DECLINED:
              status = ChargeStatus.FAILED;
              break;
            case RESULT_CODE.VERIFICATION_REQUIRED:
              status = ChargeStatus.PENDING;
              break;
            case RESULT_CODE.PARTIAL_APPROVED:
              status = ChargeStatus.PENDING;
              break;
            case RESULT_CODE.APPROVED:
              status = ChargeStatus.SUCCESS;
              break;
            default:
              status = ChargeStatus.PENDING;
          }
          logger.debug(
            `RESULT CODE: ${data.result_code},STATUS CODE: ${data.status_code}, CHARGE STATUS: ${status},ITEM ID: ${item.tradeId}, SOURCE: ${item.source} HYBRID TRANSACTION ID: ${item.hybridTransactionId}`,
          );
          if (status === ChargeStatus.SUCCESS) {
            switch (data.status_code) {
              case 'S':
                tradeStatus = ChargeStatus.SUCCESS;
                break;
              case 'E':
                tradeStatus = ChargeStatus.FAILED;
                break;
              case 'R':
                tradeStatus = ChargeStatus.FAILED;
                break;
              default:
                tradeStatus = ChargeStatus.PENDING;
                break;
            }
          } else {
            tradeStatus = status;
          }
          if (item.dwollaTransactionId != null) {
            const { status } = await dwollaService.retrieveTransfer(
              item.dwollaTransactionId,
            );
            if (status === 'processed' && status === ChargeStatus.SUCCESS) {
              tradeStatus = ChargeStatus.SUCCESS;
            }
          }
        } else if (item.transactionType === TransactionType.Wallet().getValue()) {
          const { status } = await dwollaService.retrieveTransfer(
            item.dwollaTransactionId,
          );
          switch (status) {
            case 'processed':
              tradeStatus = ChargeStatus.SUCCESS;
              break;
            case 'failed':
              tradeStatus = ChargeStatus.FAILED;
              break;
            case 'pending':
              tradeStatus = ChargeStatus.PENDING;
              break;
            case 'cancelled':
              tradeStatus = ChargeStatus.CANCELLED;
              break;
            default:
              tradeStatus = ChargeStatus.PENDING;
              break;
          }
        }
        logger.debug(`TRADE STATUS OF ${item.hybridTransactionId}: ${tradeStatus} ↑`);

        const updateHybridTransactionQuery = `update hybridTransactions set status = "${tradeStatus}" where tradeId = "${item.tradeId}"`;
        await sequelize.query(updateHybridTransactionQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });

        const chargeQuery = `select chargeId from campaignFunds where campaignFundId = "${item.campaignFundId}"`;
        const [{ chargeId }] = await sequelize.query(chargeQuery, {
          type: Sequelize.QueryTypes.SELECT,
        });
        const updateChargeQuery = `update charges set chargeStatus = "${tradeStatus}" where chargeId = "${chargeId}"`;
        await sequelize.query(updateChargeQuery, {
          type: Sequelize.QueryTypes.UPDATE,
        });

        logger.debug(`${((counter / totalRecords) * 100).toFixed(2)}% updated`);
      } catch (e) {
        logger.error(e);
      }
    });
  } catch (e) {
    logger.error(e);
  }
};
