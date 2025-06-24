import dotenv from 'dotenv';
dotenv.config();
import async from 'async';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import container from '@infrastructure/DIContainer/container';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';

const dwollaService = container.get<IDwollaService>(IDwollaServiceId);
const hybridTransactionRepository = container.get<IHybridTransactionRepoistory>(
  IHybridTransactionRepoistoryId,
);
const campaignFundRepository = container.get<ICampaignFundRepository>(
  ICampaignFundRepositoryId,
);
const chargeRepository = container.get<IChargeRepository>(IChargeRepositoryId);

export const UpdateDwollaRefundStatus = async () => {
  const hybridTransactions = await hybridTransactionRepository.fetchAllWalletThreadBankRefundApprovedTransactions();
  return async.eachSeries(
    hybridTransactions,
    async (hybridTransaction: HybridTransaction) => {
      try {
        let refundStatus = ChargeStatus.REFUND_APPROVED;
        let refunded = false;
        const { status } = await dwollaService.retrieveTransfer(
          hybridTransaction.getDwollaTransactionId(),
        );
        switch (status) {
          case 'processed':
            refunded = true;
            refundStatus = ChargeStatus.REFUNDED;
            break;
          case 'failed':
            refundStatus = ChargeStatus.REFUND_FAILED;
            break;
          default:
            refundStatus = ChargeStatus.REFUND_FAILED;
            break;
        }
        if (
          refundStatus === ChargeStatus.REFUNDED &&
          hybridTransaction.getTransactionType() === TransactionType.Hybrid().getValue()
        ) {
          if (!hybridTransaction.getAchRefunded()) {
            refunded = false;
            refundStatus = ChargeStatus.REFUND_APPROVED;
          }
        }
        if (
          refundStatus === ChargeStatus.REFUNDED ||
          refundStatus === ChargeStatus.REFUND_FAILED
        ) {
          const campaignFund = await campaignFundRepository.fetchById(
            hybridTransaction.getCampaignFundId(),
          );
          if (campaignFund) {
            const charge = campaignFund.Charge();
            charge.refunded = refunded;
            charge.setChargeStatus(refundStatus);
            hybridTransaction.status = refundStatus;
            if (refundStatus === ChargeStatus.REFUNDED) {
              hybridTransaction.walletRefunded = true;
              charge.refunded = true;
            }
            await hybridTransactionRepository.update(hybridTransaction);
            await chargeRepository.update(charge);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  );
};
