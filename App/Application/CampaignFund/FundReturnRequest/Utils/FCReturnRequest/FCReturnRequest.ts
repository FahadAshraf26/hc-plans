import { IFCReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/FCReturnRequest/IFCReturnRequest';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import { injectable } from 'inversify';

@injectable()
export class FCReturnRequest implements IFCReturnRequest {
  async execute(hybridTransaction: HybridTransaction) {
    if (hybridTransaction.status === ChargeStatus.PENDING) {
      await usaepayService.voidTransaction(hybridTransaction.getTradeId());
    }

    if (
      hybridTransaction.status === ChargeStatus.SUCCESS &&
      hybridTransaction.source === CampaignEscrow.FIRST_CITIZEN_BANK
    ) {
      await usaepayService.refundFund(
        hybridTransaction.getTradeId(),
        hybridTransaction.getRefrenceNumber(),
      );
    }

    return true;
  }
}
