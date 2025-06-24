import HttpError from '../../../Infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { ITotalInvestedAmountUseCase } from '@application/User/getTotalInvestedAmount/ITotalInvestedAmountUseCase';

@injectable()
class TotalInvestedAmountUseCase implements ITotalInvestedAmountUseCase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  // returns totalAmount invested in the last 12 months
  async execute({ userId }) {
    const user = await this.userRepository.fetchById(userId);

    if (!user) {
      throw new HttpError(400, 'no resource found');
    }

    const dateToFilterBy = new Date();
    dateToFilterBy.setMonth(dateToFilterBy.getMonth() - 12);
    const totalInvested = await this.campaignFundRepository.fetchSumByInvestorAndDate(
      user.investor.investorId,
      dateToFilterBy,
    );

    return { totalInvested };
  }
}

export default TotalInvestedAmountUseCase;
