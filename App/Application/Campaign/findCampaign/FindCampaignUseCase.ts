import FindCampaignDTO from '@application/Campaign/findCampaign/FindCampaignDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import { inject, injectable } from 'inversify';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { IFindCampaignUseCase } from '@application/Campaign/findCampaign/IFindCampaignUseCase';
import Campaign from '@domain/Core/Campaign/Campaign';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';

@injectable()
class FindCampaignUseCase implements IFindCampaignUseCase {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignNewsRepositoryId)
    private campaignNewsRepository: ICampaignNewsRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
  ) {}
  /**
   *
   * @param {FindCampaignDTO} findCampaignDTO
   * @returns Campaign
   */
  async execute(findCampaignDTO: FindCampaignDTO): Promise<Campaign> {
    let campaign: any = await this.campaignRepository.fetchById(
      findCampaignDTO.getCampaignId(),
      findCampaignDTO.isAdminRequest(),
      findCampaignDTO.getInvestorId(),
    );

    if (!campaign) {
      throw new HttpException(404, 'campaign not found');
    }

    // to public object
    if (!findCampaignDTO.isAdminRequest()) {
      campaign = campaign.toPublicDTO();
      if (campaign.issuer) {
        campaign.issuer = campaign.issuer.toPublicDTO();

        if (campaign.issuer.owners) {
          campaign.issuer.owners = campaign.issuer.owners.map((owner) => {
            owner = owner.toPublicDTO();
            if (owner.user) {
              owner.user = owner.user.toPublicObject();
            }
            return owner;
          });
        }
      }
      if (campaign.interestedInvestors) {
        const isLiked = campaign.interestedInvestors.find(
          (interestedInvestors) =>
            interestedInvestors.investorId === findCampaignDTO.getInvestorId(),
        );

        campaign.isFavorite = !!isLiked;
      }
    }

    const [
      amountInvested,
      numInvestors,
      businessUpdatecount,
      campaignQACount,
    ] = await Promise.all([
      this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        undefined,
        true,
      ),
      this.campaignFundRepository.fetchCountByCampaign(
        campaign.campaignId,
        false,
        true,
        true,
      ),
      this.campaignNewsRepository.fetchNewsCountByCampaign(campaign.campaignId),
      this.campaignQARepository.fetchQACountByCampaign(campaign.campaignId),
    ]);
    delete campaign.interestedInvestors; // delete if present

    campaign.totalFundsRaised = amountInvested;
    campaign.numInvestors = numInvestors;
    campaign.businessUpdatecount = businessUpdatecount;
    campaign.campaignQACount = campaignQACount;

    return campaign;
  }
}

export default FindCampaignUseCase;
