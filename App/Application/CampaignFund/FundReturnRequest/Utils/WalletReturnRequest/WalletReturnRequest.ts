import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import { IWalletReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/WalletReturnRequest/IWalletReturnRequest';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import Config from '@infrastructure/Config';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

const { dwolla } = Config.dwolla;

@injectable()
export class WalletReturnRequest implements IWalletReturnRequest {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionsRepository: IHybridTransactionRepoistory,
  ) {}
  async execute(hybridTransaction: HybridTransaction, dwollaCustomer) {
    if (hybridTransaction.status === ChargeStatus.PENDING) {
      await this.dwollaService.cancelTransaction(hybridTransaction.getTradeId());
    }

    if (
      hybridTransaction.status === ChargeStatus.SUCCESS &&
      hybridTransaction.source === CampaignEscrow.FIRST_CITIZEN_BANK
    ) {
      const dwollaTransactionId = await this.dwollaService.createTransfer({
        sourceId: dwolla.DWOLLA_HONEYCOMB_WALLET_ID,
        destinationId: dwollaCustomer.getDwollaBalanceId(),
        amount:
          Number(hybridTransaction.getAmount()) +
          Number(hybridTransaction.getApplicationFee()),
        fee: 0,
        sameDayACH: false,
        idempotencyKey: undefined,
      });
      hybridTransaction.setDwollaTransactionId(dwollaTransactionId);
      hybridTransaction.setIndividualACHId('NULL');
      await this.hybridTransactionsRepository.update(hybridTransaction);
    }

    return true;
  }
}
