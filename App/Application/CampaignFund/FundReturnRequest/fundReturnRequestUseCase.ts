import FundReturnRequestDTO from '@application/CampaignFund/FundReturnRequest/FundReturnRequestDTO';
import { IFundReturnRequestUseCase } from '@application/CampaignFund/FundReturnRequest/IFundRefturnRequestUseCase';
import {
  INCReturnRequest,
  INCReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/NCReturnRequest/INCReturnRequest';
import {
  IFCReturnRequest,
  IFCReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/FCReturnRequest/IFCReturnRequest';
import {
  IStripeReturnRequest,
  IStripeReturnRequestId,
} from '@application/CampaignFund/FundReturnRequest/Utils/StripeReturnRequest/IStripeReturnRequest';
import {
  IAdminUserRepository,
  IAdminUserRepositoryId,
} from '@domain/Core/AdminUser/IAdminUserRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import CampaignFund from '@domain/Core/CampaignFunds/CampaignFund';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import {
  IWalletReturnRequest,
  IWalletReturnRequestId,
} from './Utils/WalletReturnRequest/IWalletReturnRequest';
import {
  IHybridReturnRequest,
  IHybridReturnRequestId,
} from './Utils/HybridReturnRequest/IHybridReturnRequest';
import moment from 'moment';

@injectable()
class FundReturnRequestUseCase implements IFundReturnRequestUseCase {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(INCReturnRequestId) private ncReturnRequest: INCReturnRequest,
    @inject(IAdminUserRepositoryId) private adminUserRepository: IAdminUserRepository,
    @inject(IFCReturnRequestId)
    private fcReturnRequest: IFCReturnRequest,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
    @inject(IStripeReturnRequestId)
    private stripeReturnRequest: IStripeReturnRequest,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionsRepository: IHybridTransactionRepoistory,
    @inject(IWalletReturnRequestId)
    private walletReturnRequest: IWalletReturnRequest,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomer: IHoneycombDwollaCustomerRepository,
    @inject(IHybridReturnRequestId) private hybridReturnRequest: IHybridReturnRequest,
  ) {}

  async fetchCampaignFund(campaignFundId: string): Promise<CampaignFund> {
    const campaignFund = await this.campaignFundRepository.fetchById(campaignFundId);

    if (!campaignFund) {
      throw new HttpError(400, 'Campaign Fund not found');
    }

    return campaignFund;
  }

  async fetchCampaign(campaignId: string) {
    const campaign = await this.campaignRepository.fetchById(campaignId);
    if (!campaign) {
      throw new HttpError(400, 'Campaign not found');
    }

    return campaign;
  }

  async fetchInvestorBank(investorId: string) {
    const investorBank = await this.investorPaymentOptionsRepository.fetchInvestorBank(
      investorId,
    );
    if (!investorBank) throw new HttpError(400, 'Investor not found!');
    return investorBank;
  }

  async fetchInvestor(investorId: string) {
    const investor = await this.userRepository.fetchByInvestorId(investorId);
    if (!investor) {
      throw new HttpError(400, 'Investor not found!');
    }
    return investor;
  }

  async fetchDwollaCustomer(userId: string) {
    const dwollaCustomer = await this.honeycombDwollaCustomer.fetchByUserId(userId);
    if (!dwollaCustomer) {
      throw new HttpError(400, 'wallet not found');
    }
    return dwollaCustomer;
  }

  async execute(fundReturnRequestDTO: FundReturnRequestDTO): Promise<boolean> {
    const campaignFund = await this.fetchCampaignFund(
      fundReturnRequestDTO.CampaignFundId(),
    );
    const user = await this.fetchInvestor(campaignFund.InvestorId());
    const dwollaCustomer = await this.fetchDwollaCustomer(user.userId);
    const adminUser = await this.adminUserRepository.fetchById(
      fundReturnRequestDTO.RequestedBy(),
    );
    const charge = campaignFund.Charge();

    const campaign = await this.campaignRepository.fetchById(campaignFund.CampaignId());

    await Promise.all(
      campaignFund.hybridTransactions.map(async (hybridTransaction) => {
        if (hybridTransaction.source === CampaignEscrow.NC_BANK) {
          await this.ncReturnRequest.execute({
            hybridTransaction,
            adminUser,
            user,
            ip: fundReturnRequestDTO.Ip(),
          });
        }
        if (hybridTransaction.source === CampaignEscrow.STRIPE) {
          await this.stripeReturnRequest.execute(hybridTransaction);
        }
        if (
          (hybridTransaction.source === CampaignEscrow.FIRST_CITIZEN_BANK ||
            CampaignEscrow.THREAD_BANK) &&
          hybridTransaction.transactionType === TransactionType.ACH().getValue()
        ) {
          await this.fcReturnRequest.execute(hybridTransaction);
        }
        if (
          hybridTransaction.source ===
            (CampaignEscrow.FIRST_CITIZEN_BANK || CampaignEscrow.THREAD_BANK) &&
          hybridTransaction.transactionType === TransactionType.Wallet().getValue()
        ) {
          await this.walletReturnRequest.execute(hybridTransaction, dwollaCustomer);
        }
        if (
          hybridTransaction.source ===
            (CampaignEscrow.FIRST_CITIZEN_BANK || CampaignEscrow.THREAD_BANK) &&
          hybridTransaction.transactionType === TransactionType.Hybrid().getValue()
        ) {
          await this.hybridReturnRequest.execute(hybridTransaction, dwollaCustomer);
        }
        if (hybridTransaction.status === ChargeStatus.PENDING) {
          hybridTransaction.status = ChargeStatus.CANCELATION_PENDING;
          await this.hybridTransactionsRepository.update(hybridTransaction);
          charge.setChargeStatus(ChargeStatus.CANCELATION_PENDING);
          charge.setRefundRequestedDate(moment.now())
          await this.chargeRepository.update(charge);
        } else if (hybridTransaction.status === ChargeStatus.SUCCESS) {
          hybridTransaction.status = ChargeStatus.PENDING_REFUND;
          await this.hybridTransactionsRepository.update(hybridTransaction);
          charge.setChargeStatus(ChargeStatus.PENDING_REFUND);
          charge.setRefundRequestedDate(moment.now())
          await this.chargeRepository.update(charge);
        }
      }),
    );

    return true;
  }
}

export default FundReturnRequestUseCase;
