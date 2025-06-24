import uuid from 'uuid/v4';
import dotenv from 'dotenv';
dotenv.config();
import async from 'async';
import container from '@infrastructure/DIContainer/container';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  IAsanaService,
  IAsanaServiceId,
} from '@infrastructure/Service/Asana/IAsanaService';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import logger from '@infrastructure/Logger/logger';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import models from '../App/Infrastructure/Model';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';

const { UserModel } = models;

const hybridTransactionRepoistory = container.get<IHybridTransactionRepoistory>(
  IHybridTransactionRepoistoryId,
);
const chargeRepository = container.get<IChargeRepository>(IChargeRepositoryId);
const campaignRepository = container.get<ICampaignRepository>(ICampaignRepositoryId);
const investorDao = container.get<IInvestorDao>(IInvestorDaoId);
const campaignFundRepository = container.get<ICampaignFundRepository>(
  ICampaignFundRepositoryId,
);
const asanaService = container.get<IAsanaService>(IAsanaServiceId);

export const WalletDebitAuthorization = async () => {
  const hybridTransactions = await hybridTransactionRepoistory.fetchAllWalletThreadBankPendingRefundTransactions();

  let walletAmount = 0;
  let debitAuthorizationId = uuid();
  let investorDetails = [];

  await async.eachSeries(
    hybridTransactions,
    async (hybridTransaction: HybridTransaction) => {
      const camapaignFund = await campaignFundRepository.fetchById(
        hybridTransaction.getCampaignFundId(),
      );

      if (camapaignFund) {
        const campaign = await campaignRepository.fetchById(camapaignFund.CampaignId());
        let options = {
          includes: [
            {
              model: UserModel,
              as: 'user',
              required: true,
            },
          ],
        };
        const investor = await investorDao.fetchById(camapaignFund.InvestorId(), options);

        if (
          hybridTransaction.getTransactionType() === TransactionType.Wallet().getValue()
        ) {
          walletAmount =
            roundToTwoDecimals(walletAmount) +
            roundToTwoDecimals(hybridTransaction.getAmount());
        } else {
          walletAmount =
            roundToTwoDecimals(walletAmount) +
            roundToTwoDecimals(hybridTransaction.getWalletAmount());
        }

        investorDetails.push({
          campaignName: campaign.campaignName,
          investorName:
            investor.user.dataValues.firstName + ' ' + investor.user.dataValues.lastName,
          amount:
            hybridTransaction.getTransactionType() === TransactionType.Wallet().getValue()
              ? hybridTransaction.getAmount()
              : hybridTransaction.getWalletAmount(),
        });

        const charge = camapaignFund.Charge();
        await hybridTransactionRepoistory.updateStatusAndDebitAuthorizationId(
          hybridTransaction.getHybridTransactionId(),
          ChargeStatus.REFUND_PROCESSING,
          debitAuthorizationId,
        );
        charge.setChargeStatus(ChargeStatus.REFUND_PROCESSING);
        await chargeRepository.update(charge);
      }
    },
  );

  logger.debug(`AMOUNT: ${walletAmount}`);

  if (walletAmount > 0) {
    await asanaService.createTaskForDwollaRefunds(
      walletAmount,
      debitAuthorizationId,
      investorDetails,
    );
  }
  logger.info('Asana Ticket created.');
};

const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
