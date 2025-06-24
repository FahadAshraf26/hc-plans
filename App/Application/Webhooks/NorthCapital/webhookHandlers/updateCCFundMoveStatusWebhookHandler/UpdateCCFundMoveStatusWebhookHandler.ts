import DeleteInvestorPaymentOptionDTO from '@application/InvestorBank/deleteInvestorPaymentOption/DeleteInvestorPaymentPaymentDTO';
import { IUpdateCCFundMoveStatusWebhookHandler } from '@application/Webhooks/NorthCapital/webhookHandlers/updateCCFundMoveStatusWebhookHandler/IUpdateCCFundMoveStatusWebhookHandler';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import { BankFundMoveStatus } from '@domain/Core/ValueObjects/NorthCapital/BankFundMoveStatus';
import emailTemplates from '@domain/Utils/EmailTemplates';
import mailService from '@infrastructure/Service/MailService';
import { inject, injectable } from 'inversify';
import {
  IDeleteInvestorPaymentOptionUseCase,
  IDeleteInvestorPaymentOptionUseCaseId,
} from '../../../../InvestorBank/deleteInvestorPaymentOption/IDeleteInvestorPaymentOptionUseCase';

const { SendHtmlEmail, BakeEmail } = mailService;
const { customerTransferFailedTemplate, paymentOptionRemovedTemplate } = emailTemplates;

@injectable()
class UpdateCCFundMoveStatusWebhookHandler
  implements IUpdateCCFundMoveStatusWebhookHandler {
  constructor(
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IDeleteInvestorPaymentOptionUseCaseId)
    private deleteInvestorPaymentOption: IDeleteInvestorPaymentOptionUseCase,
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
    let cardName;
    if (isInvestment.investor.investorBanks) {
      const card = isInvestment.investor.investorBanks.find((paymentOption) =>
        paymentOption.isCard(),
      );

      if (card) {
        dto['INVESTOR_BANK_ACCOUNT_NAME'] = card.Name();
        cardName = card.Name();

        if (payload.errors && payload.errors.includes('Invalid Account Number')) {
          const deleteDto = DeleteInvestorPaymentOptionDTO.create({
            investorPaymentOptionId: card.getInvestorPaymentOptionsId(),
            investorId: isInvestment.investor.investorId,
            hardDelete: 'false',
            ip: '34.75.170.37',
          });

          try {
            await this.deleteInvestorPaymentOption.execute(deleteDto);
            const html = paymentOptionRemovedTemplate
              .replace('{@FIRST_NAME}', isInvestment.investor.user.firstName)
              .replace('{@INVESTOR_BANK_ACCOUNT_NAME}', cardName);
            await SendHtmlEmail(dto.INVESTOR_EMAIL, 'Payment Option Removed', html);
          } catch (err) {}
        }
      } else {
        dto['INVESTOR_BANK_ACCOUNT_NAME'] = '';
      }
    }

    const html = customerTransferFailedTemplate
      .replace('{@FIRST_NAME}', isInvestment.investor.user.firstName)
      .replace('{@AMOUNT}', isInvestment.Amount())
      .replace('{@CAMPAIGN_NAME}', isInvestment.campaign.campaignName)
      .replace('{@INVESTOR_BANK_ACCOUNT_NAME}', cardName);
    await SendHtmlEmail(dto.INVESTOR_EMAIL, 'Investment Failed', html);
  }

  async sendSuccessfulTransactionEmail(charge) {}
}

export default UpdateCCFundMoveStatusWebhookHandler;
