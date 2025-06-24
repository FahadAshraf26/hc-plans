import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { inject, injectable } from 'inversify';
import GetAllCampaignsDTO from '@application/Campaign/getAllCampaigns/GetAllCampaignsDTO';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import CampaignOrderService from '@domain/Services/Campaigns/CampaignOrderService';
import { IGetAllCampaignsUseCase } from '@application/Campaign/getAllCampaigns/IGetAllCampaignsUseCase';
import {
  IRedisService,
  IRedisServiceId,
} from '@infrastructure/Service/RedisService/IRedisService';

type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};

@injectable()
class GetAllCampaignsUseCase implements IGetAllCampaignsUseCase {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IRedisServiceId) private redisService: IRedisService,
  ) {}

  /**
   *
   * @param {GetCampaignsDTO} getCampaignsDTO
   * @return {Promise<void>}
   */
  async execute(getCampaignsDTO: GetAllCampaignsDTO): Promise<response> {
    let result: any;
    if (getCampaignsDTO.isAdminRequest()) {
      result = await this.campaignRepository.fetchAllForAdmin({
        paginationOptions: getCampaignsDTO.getPaginationOptions(),
        options: {
          showTrashed: getCampaignsDTO.isShowTrashed(),
          campaignStage: getCampaignsDTO.getCampaignStage(),
          showFailed: getCampaignsDTO.isShowFailed(),
          investorId: getCampaignsDTO.getInvestorId(),
          isAdminRequest: getCampaignsDTO.isAdminRequest(),
          search: getCampaignsDTO.getSearch(),
          sortBy: getCampaignsDTO.getSortBy(),
          sortPriority: getCampaignsDTO.getSortPriority(),
        },
      });
    } else {
      result = await this.campaignRepository.fetchAll({
        paginationOptions: getCampaignsDTO.getPaginationOptions(),
        options: {
          showTrashed: getCampaignsDTO.isShowTrashed(),
          search: getCampaignsDTO.getSearch(),
          campaignStage: getCampaignsDTO.getCampaignStage(),
          showFailed: getCampaignsDTO.isShowFailed(),
          tags: getCampaignsDTO.getTags(),
        },
      });
    }

    const campaigns = result.getPaginatedData();

    // if public request , remove internal fields
    if (!getCampaignsDTO.isAdminRequest()) {
      campaigns.data = campaigns.data.map((campaign: any) => {
        campaign = campaign.toPublicDTO();
        if (campaign.issuer) {
          campaign.issuer = campaign.issuer.toPublicDTO();
        }
        return campaign;
      });
    }

    for (const campaign of campaigns.data) {
      if (getCampaignsDTO.getInvestorId()) {
        const isLiked = campaign.interestedInvestors.find(
          (interestedInvestors) =>
            interestedInvestors.investorId === getCampaignsDTO.getInvestorId(),
        );

        campaign.isFavorite = !!isLiked;
      }

      if (getCampaignsDTO.isAdminRequest()) {
        const [amountInvested, investmentCount, numInvestors] = await Promise.all([
          this.campaignFundRepository.fetchSumInvestmentByCampaign(
            campaign.campaignId,
            undefined,
            true,
          ),
          this.campaignFundRepository.fetchCountByCampaign(
            campaign.campaignId,
            false,
            false,
            true,
          ),
          this.campaignFundRepository.fetchCountByCampaign(
            campaign.campaignId,
            false,
            true,
            true,
          ),
        ]);
        campaign.amountInvested = amountInvested;
        campaign.investmentCount = investmentCount;
        campaign.numInvestors = numInvestors;
      } else {
        const amountInvested = await this.campaignFundRepository.fetchSumInvestmentByCampaign(
          campaign.campaignId,
          undefined,
          true,
        );
        campaign.amountInvested = amountInvested;
      }

      delete campaign.interestedInvestors; // delete if present
    }
    if (!getCampaignsDTO.isAdminRequest()) {
      campaigns.data = await CampaignOrderService.createFromCampaigns(
        campaigns.data,
        this.redisService,
      ).setActiveCampaignOrder();
    }

    return campaigns;
  }
}

export default GetAllCampaignsUseCase;
