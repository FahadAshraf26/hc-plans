import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { inject, injectable } from 'inversify';
import { IInvestorMeetsCriteria } from './IInvestorMeetsCriteria';

@injectable()
class InvestorMeetsCriteria implements IInvestorMeetsCriteria {
  constructor(
    @inject(ICampaignFundRepositoryId) private fundRepository: ICampaignFundRepository,
  ) {}

  getAmountInvestedByInvestorInLastTwelveMonths = async (investorId)  => {
    const dateToFilterBy = new Date();
    dateToFilterBy.setMonth(dateToFilterBy.getMonth() - 12);

    return this.fundRepository.fetchSumByInvestorAndDate(investorId, dateToFilterBy);
  }

    validateInvestorMeetsCriteria = async (dto, campaignFundService)  => {
    const amountInvestedInLastTwelveMonths = await this.getAmountInvestedByInvestorInLastTwelveMonths(
      dto.InvestorId(),
    );
    if (!dto.EntityId()) {
      campaignFundService.validateUser(amountInvestedInLastTwelveMonths);
    }

    return campaignFundService.getInvestmentType(amountInvestedInLastTwelveMonths);
  }
}

export default InvestorMeetsCriteria;
