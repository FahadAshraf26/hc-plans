import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from './../../UncaughtException/IUncaughtExceptionService';
import { IChargeRepositoryId } from './../../../Domain/Core/Charge/IChargeRepository';
import { IChargeRepository } from '@domain/Core/Charge/IChargeRepository';
import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from './../../../Domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from './../../../Domain/Core/Campaign/ICampaignRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import SendSubscritionDocumentDTO from './SendSubscriptionDocumentsDTO';
import moment from 'moment';
import { ISendSubscriptionDocumentsUseCase } from './ISendSubscriptionDocumentsUseCase';

@injectable()
class SendSubscriptionDocumentsUseCase implements ISendSubscriptionDocumentsUseCase {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignFundRepositoryId) private fundRepository: ICampaignFundRepository,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IUncaughtExceptionServiceId)
    private uncaughtExceptionService: IUncaughtExceptionService,
  ) {}

  async execute(dto: SendSubscritionDocumentDTO) {
    const campaign = await this.campaignRepository.fetchById(dto.getcampaignId());

    if (!campaign) {
      throw new HttpError(400, 'resource not found');
    }

    const campaignFunds = await this.fundRepository.fetchAllByCampaignWithSuccessfulChargesAndWithoutDocumentSent(
      dto.getcampaignId(),
    );

    const res: any = await Promise.allSettled([
      ...campaignFunds.map(async (fund) => {
        const charge = fund.charge;
        try {
          if (charge.documentSent) {
            throw Error('document already sent');
          }

          await northCapitalService.sendSubscriptionDocument({
            offeringId: campaign.ncOfferingId,
            tradeId: charge.dwollaChargeId,
            accountId: fund.investor.ncAccountId,
          });

          (charge.documentSent = moment().format('YYYY-MM-DD')),
            await this.chargeRepository.update(charge);
        } catch (err) {
          throw {
            message: 'Failed',
            offeringId: campaign.ncOfferingId,
            tradeId: charge.dwollaChargeId,
            accountId: fund.investor.ncAccountId,
            errorMessage: err.message,
          };
        }
      }),
    ]);

    const failed = res.filter((res) => {
      return res.status === 'rejected' || !!res.reason;
    });
    if (!!failed.length) {
      await this.uncaughtExceptionService.logException(
        {
          data: {
            ...failed.map((f) => f.reason),
            successful: res.length - failed.length,
          },
        },
        new Error('Failed to send subscription document'),
      );
      throw Error('Failed to send subscription document');
    }

    return res.length;
  }
}

export default SendSubscriptionDocumentsUseCase;
