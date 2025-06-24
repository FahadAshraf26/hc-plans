import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { inject, injectable } from 'inversify';
import InvestmentType from '@domain/Core/CampaignFunds/InvestmentType';
import { ICampaignMeetsCriteria } from './ICampaignMeetsCriteria';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';

@injectable()
class CampaignMeetsCriteria implements ICampaignMeetsCriteria {
  constructor(
    @inject(ICampaignFundRepositoryId) private fundRepository: ICampaignFundRepository,
  ) {}

  getSumOfInvestmentGroupByInvestmentType = async (campaignId): Promise<any> => {
    return Promise.all([
      this.fundRepository.fetchSumInvestmentByCampaign(
        campaignId,
        InvestmentType.investmentTypes.regD,
      ),
      this.fundRepository.fetchSumInvestmentByCampaign(
        campaignId,
        InvestmentType.investmentTypes.regCF,
      ),
    ]);
  };

  validateCampaignMeetsCriteria = async (campaign, campaignFundService) => {
    const [
      campaignAccreditedRaised,
      campaignNonAccreditedRaised,
    ] = await this.getSumOfInvestmentGroupByInvestmentType(campaign.CampaignId());

    campaignFundService.validateCampaign({
      campaignAccreditedRaised,
      campaignNonAccreditedRaised,
      campaign,
    });
  };
}

export default CampaignMeetsCriteria;
