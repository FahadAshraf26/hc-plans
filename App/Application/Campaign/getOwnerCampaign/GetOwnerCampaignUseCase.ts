import { injectable, inject } from 'inversify';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '../../../Domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '../../../Domain/Core/CampaignFunds/ICampaignFundRepository';
import GetOwnerCampaignDTO from '@application/Campaign/getOwnerCampaign/GetOwnerCampaignDTO';
import { IGetOwnerCampaignUseCase } from '@application/Campaign/getOwnerCampaign/IGetOwnerCampaignUseCase';

type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};

@injectable()
class GetOwnerCampaignUseCase implements IGetOwnerCampaignUseCase {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
  ) {}

  async execute(dto: GetOwnerCampaignDTO): Promise<response> {
    const result = await this.campaignRepository.getOwnerCampaigns(
      dto.getUserId(),
      dto.getPaginationOptions(),
    );

    const campaigns = result.getPaginatedData();

    campaigns.data = await Promise.all(
      campaigns.data.map(async (campaign) => {
        const [amountInvested, numInvestors] = await Promise.all([
          this.campaignFundRepository.fetchSumInvestmentByCampaign(campaign.campaignId),
          this.campaignFundRepository.fetchCountByCampaign(
            campaign.campaignId,
            false,
            true,
          ),
        ]);

        campaign.totalFundsRaised = amountInvested;
        campaign.numInvestors = numInvestors;

        return campaign;
      }),
    );

    return campaigns;
  }
}

export default GetOwnerCampaignUseCase;
