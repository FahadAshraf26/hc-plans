import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { BankFundMoveStatus } from '@domain/Core/ValueObjects/NorthCapital/BankFundMoveStatus';
import emailTemplates from '@domain/Utils/EmailTemplates';

const { customerTransferFailedTemplate } = emailTemplates;
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import mailService from '@infrastructure/Service/MailService';
import { inject, injectable } from 'inversify';
import { IUpdateBankFundMoveStatusWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/updateBankFundMoveStatusWebhookHandler/IUpdateBankFundMoveStatusWebhookHandler';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';

const { SendHtmlEmail, BakeEmail } = mailService;

@injectable()
class UpdateBankFundMoveStatusWebhookHandler
  implements IUpdateBankFundMoveStatusWebhookHandler {
  constructor(
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepository: IHybridTransactionRepoistory,
  ) {}

  async execute(dto) {
    await new Promise((r) => setTimeout(r, 5000));
    let tradeStatus;

    const { RefNum, fundStatus } = dto.payload();

    if (!RefNum) {
      throw Error('no refNum in payload');
    }

    switch (fundStatus) {
      case BankFundMoveStatus.SUBMITTED:
      case BankFundMoveStatus.SETTLED:
        tradeStatus = ChargeStatus.SUCCESS;
        break;
      case BankFundMoveStatus.RETURNED:
        tradeStatus = ChargeStatus.FAILED;
        break;
      default:
        break;
    }

    const charge = await this.chargeRepository.fetchByReferenceNumber(RefNum);
    if (!charge) {
      const trade = await this.hybridTransactionRepository.fetchOneByCustomCritera({
        whereConditions: {
          refrenceNumber: RefNum,
        },
      });
      if (!trade) {
        return false;
      }
      const fund = await this.campaignFundRepository.fetchById(trade.campaignFundId);

      trade.status = tradeStatus;
      await this.hybridTransactionRepository.update(trade);
      if (tradeStatus === ChargeStatus.FAILED) {
        await this.sendFailedTransactionEmail(fund['charge'], dto.payload());
      }
      return;
    } else {
      charge.setChargeStatus(tradeStatus);
      await this.chargeRepository.update(charge);
      if (tradeStatus === ChargeStatus.FAILED) {
        await this.sendFailedTransactionEmail(charge, dto.payload());
      }
      return;
    }
  }

  async sendFailedTransactionEmail(charge, payload) {
    const isInvestment = await this.campaignFundRepository.fetchByChargeId(
      charge.chargeId,
    );

    if (!isInvestment) {
      return false;
    }

    const dto: any = {};

    dto['AMOUNT'] = isInvestment.Amount();

    if (isInvestment.investor) {
      dto['INVESTOR_EMAIL'] = isInvestment.investor.user.email;
      dto['FIRST_NAME'] = isInvestment.investor.user.firstName;
    }

    if (isInvestment.campaign) {
      dto['CAMPAIGN_NAME'] = isInvestment.campaign.campaignName;
    }
    let bankName;
    if (isInvestment.investor.investorBanks) {
      const bank = isInvestment.investor.investorBanks.find((paymentOption) =>
        paymentOption.isBank(),
      );

      if (bank) {
        bankName = bank.Name();
      }
    }

    const html = customerTransferFailedTemplate
      .replace('{@FIRST_NAME}', isInvestment.investor.user.firstName)
      .replace('{@AMOUNT}', isInvestment.Amount())
      .replace('{@CAMPAIGN_NAME}', isInvestment.campaign.campaignName)
      .replace('{@INVESTOR_BANK_ACCOUNT_NAME}', bankName);
    await SendHtmlEmail(dto.INVESTOR_EMAIL, 'Investment Failed', html);
  }

  async sendSuccessfulTransactionEmail(charge) {}
}

export default UpdateBankFundMoveStatusWebhookHandler;
