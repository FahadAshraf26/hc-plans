import CampaignDocument from '@domain/Core/CampaignDocument/CampaignDocument';
import {
  ICampaignDocumentRepository,
  ICampaignDocumentRepositoryId,
} from '@domain/Core/CampaignDocument/ICampaignDocumentRepository';
import FindCampaignInfoDTO from '@application/Campaign/findCampaignInfo/FindCampaignInfoDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import { IssuerStatus } from '@domain/Core/ValueObjects/IssuerStatus';
import { InvestorInvestmentType } from '@domain/Core/ValueObjects/InvestorInvestmentType';
import { inject, injectable } from 'inversify';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  ICampaignNewsRepository,
  ICampaignNewsRepositoryId,
} from '@domain/Core/CampaignNews/ICampaignNewsRepository';
import {
  IFavoriteCampaignRepository,
  IFavoriteCampaignRepositoryId,
} from '@domain/Core/FavoriteCampaign/IFavoriteCampaignRepository';
import {
  ICampaignQARepository,
  ICampaignQARepositoryId,
} from '@domain/Core/CampaignQA/ICampaignQARepository';
import { IFindCampaignInfoUseCase } from '@application/Campaign/findCampaignInfo/IFindCampaignInfoUseCase';

@injectable()
class FindCampaignInfoUseCase implements IFindCampaignInfoUseCase {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(ICampaignNewsRepositoryId)
    private campaignNewsRepository: ICampaignNewsRepository,
    @inject(IFavoriteCampaignRepositoryId)
    private favoriteCampaignRepository: IFavoriteCampaignRepository,
    @inject(ICampaignQARepositoryId) private campaignQARepository: ICampaignQARepository,
    @inject(ICampaignDocumentRepositoryId)
    private campaignDocumentRepository: ICampaignDocumentRepository,
  ) {}
  /**
   *
   * @param {FindCampaignInfoDTO} findCampaignInfoDTO
   * @returns Campaign
   */
  async execute(findCampaignInfoDTO: FindCampaignInfoDTO) {
    const campaign = await this.campaignRepository.fetchCampaignInfoById(
      findCampaignInfoDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(404, 'campaign not found');
    }

    if (campaign.issuer) {
      campaign.applicationReviewResult =
        campaign.issuer.issuerStatus === IssuerStatus.APPROVED ? 'Pass' : 'Fail';
    }

    const [
      sumRegCF,
      sumRegD,
      investmentCount,
      numInvestors,
      businessUpdatecount,
      campaignLikesCount,
      campaignQACount,
      noOfInvestorWithdrawn,
      numRefundRequested,
      campaignSignImage,
    ] = await Promise.all([
      this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        InvestorInvestmentType.REG_CF,
      ),
      this.campaignFundRepository.fetchSumInvestmentByCampaign(
        campaign.campaignId,
        InvestorInvestmentType.REG_D,
      ),
      this.campaignFundRepository.fetchCountByCampaign(campaign.campaignId),
      this.campaignFundRepository.fetchCountByCampaign(campaign.campaignId, false, true),
      this.campaignNewsRepository.fetchNewsCountByCampaign(campaign.campaignId),
      this.favoriteCampaignRepository.fetchLikesCountByCampaign(campaign.campaignId),
      this.campaignQARepository.fetchQACountByCampaign(campaign.campaignId),
      this.campaignFundRepository.fetchCountByCampaign(campaign.campaignId, true),
      this.campaignFundRepository.fetchRefundRequestedCountByCampaign(
        campaign.campaignId,
      ),
      this.campaignDocumentRepository.fetchByCampaignAndType(
        campaign.campaignId,
        'SignatureImage',
      ),
    ]);

    campaign.noOfInvestorWithdrawn = noOfInvestorWithdrawn;
    campaign.campaignLikesCount = campaignLikesCount;
    campaign.amountInvested = sumRegCF + sumRegD;
    campaign.investmentCount = investmentCount;
    campaign.numInvestors = numInvestors;
    campaign.numRefundRequested = numRefundRequested;
    campaign.businessUpdateCount = businessUpdatecount;
    campaign.campaignQACount = campaignQACount;
    campaign.regCFFunds = sumRegCF;
    campaign.regDFunds = sumRegD;
    campaign.badActorScreeningResult = !campaign.badActorInfoIdentityAtTimeOfOnboarding
      ? 'Pass'
      : 'Fail';
    if (campaignSignImage) {
      campaign.setSignImage(CampaignDocument.createFromObject(campaignSignImage));
    }

    return campaign;
  }
}
export default FindCampaignInfoUseCase;
