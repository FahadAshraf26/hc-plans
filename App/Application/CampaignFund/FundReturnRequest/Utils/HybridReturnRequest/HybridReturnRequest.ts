import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import Config from '@infrastructure/Config';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { IHybridReturnRequest } from './IHybridReturnRequest';
import { usaepayService } from '@infrastructure/Service/PaymentProcessor';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

const { dwolla } = Config.dwolla;

@injectable()
export class HybridReturnRequest implements IHybridReturnRequest {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionsRepository: IHybridTransactionRepoistory,
  ) {}
  async execute(hybridTransaction: HybridTransaction, dwollaCustomer) {
    if (hybridTransaction.status === ChargeStatus.PENDING) {
      await this.dwollaService.cancelTransaction(
        hybridTransaction.getDwollaTransactionId(),
      );
      await usaepayService.voidTransaction(hybridTransaction.getTradeId());
    }

    if (
      hybridTransaction.status === ChargeStatus.SUCCESS &&
      hybridTransaction.source === CampaignEscrow.FIRST_CITIZEN_BANK
    ) {
      const dwollaTransactionId = await this.dwollaService.createTransfer({
        sourceId: dwolla.DWOLLA_HONEYCOMB_WALLET_ID,
        destinationId: dwollaCustomer.getDwollaBalanceId(),
        amount: hybridTransaction.getWalletAmount(),
        fee: 0,
        sameDayACH: false,
        idempotencyKey: undefined,
      });
      hybridTransaction.setDwollaTransactionId(dwollaTransactionId);
      hybridTransaction.setIndividualACHId('NULL');
      await this.hybridTransactionsRepository.update(hybridTransaction);
      await usaepayService.refundFund(
        hybridTransaction.getTradeId(),
        hybridTransaction.getRefrenceNumber(),
      );
    }

    return true;
  }
}
