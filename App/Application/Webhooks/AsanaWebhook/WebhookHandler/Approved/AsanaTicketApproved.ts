import async from 'async';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { inject, injectable } from 'inversify';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import Config from '@infrastructure/Config';
import { IAsanaTicketApproved } from './IAsanaTicketApproved';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
const { dwolla } = Config.dwolla;

@injectable()
class AsanaTicketApproved implements IAsanaTicketApproved {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomer: IHoneycombDwollaCustomerRepository,
  ) {}

  async execute(debitAuthorizationId: string) {
    const hybridTransactions = await this.hybridTransactionRepository.fetchAllByDebitAuthorizationId(
      debitAuthorizationId,
    );
    await async.eachSeries(
      hybridTransactions,
      async (hybridTransaction: HybridTransaction) => {
        const campaignFund = await this.campaignFundRepository.fetchById(
          hybridTransaction.getCampaignFundId(),
        );

        if (campaignFund && hybridTransaction.status === ChargeStatus.REFUND_PROCESSING) {
          const user = await this.userRepository.fetchByInvestorId(
            campaignFund.InvestorId(),
          );

          const dwollaCustomer = await this.honeycombDwollaCustomer.fetchByCustomerTypeAndUser(
            user.userId,
            'Personal',
          );

          const dwollaTransactionId = await this.dwollaService.createTransfer({
            sourceId: dwolla.DWOLLA_HONEYCOMB_THREAD_BANK,
            destinationId: dwollaCustomer.getDwollaBalanceId(),
            amount:
              hybridTransaction.getTransactionType() ===
              TransactionType.Hybrid().getValue()
                ? hybridTransaction.getWalletAmount()
                : Number(hybridTransaction.getAmount()) +
                  Number(hybridTransaction.getApplicationFee()),
            fee: 0,
            sameDayACH: false,
            idempotencyKey: undefined,
          });

          await new Promise((f) => setTimeout(f, 5000));

          if (dwollaTransactionId) {
            hybridTransaction.setDwollaTransactionId(dwollaTransactionId);
            hybridTransaction.setIndividualACHId('NULL');
            hybridTransaction.setStatus(ChargeStatus.REFUND_APPROVED);
            const charge = campaignFund.Charge();
            charge.setChargeStatus(ChargeStatus.REFUND_APPROVED);
            await this.hybridTransactionRepository.update(hybridTransaction);
            await this.chargeRepository.update(charge);
          }
        }
      },
    );
  }
}

export default AsanaTicketApproved;
