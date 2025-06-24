import Campaign from '@domain/Core/Campaign/Campaign';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import User from '@domain/Core/User/User';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';
import HttpError from '@infrastructure/Errors/HttpException';
import Guard from '@infrastructure/Utils/Guard';
import { inject, injectable } from 'inversify';
import { IFetchEntitiesFromDatabase } from './IFetchEntitiesFromDatabase';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';

type entitiesFromDatabaseOptions = {
  user: User;
  campaign: Campaign;
  paymentOption: InvestorPaymentOptions;
};

@injectable()
class FetchEntitiesFromDatabase implements IFetchEntitiesFromDatabase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
  ) {}

  fetchEntitiesFromDatabase = async (dto): Promise<entitiesFromDatabaseOptions> => {
    const [user, campaign] = await Promise.all([
      this.userRepository.fetchById(dto.UserId()),
      this.campaignRepository.fetchById(dto.CampaignId()),
    ]);

    let paymentOption;
    if (dto.TransactionType() === TransactionType.CreditCard().getValue()) {
      let isStripeCard =
        campaign.escrowType === CampaignEscrow.FIRST_CITIZEN_BANK ? true : false;
      paymentOption = await this.investorPaymentOptionsRepository.fetchInvestorCard(
        user.investor.investorId,
        isStripeCard,
      );
    } else {
      paymentOption = await this.investorPaymentOptionsRepository.fetchInvestorBank(
        user.investor.investorId,
      );
    }
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: user, argumentName: 'user' },
      { argument: user.investor, argumentName: 'investor' },
      { argument: campaign, argumentName: 'campaign' },
      { argument: campaign.issuer, argumentName: 'issuer' },
    ]);

    if (!guardResult.succeeded) {
      throw new HttpError(400, guardResult.message);
    }

    return {
      user,
      campaign,
      paymentOption,
    };
  };
}

export default FetchEntitiesFromDatabase;
