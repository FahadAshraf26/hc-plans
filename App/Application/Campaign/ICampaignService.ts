import GetAllCampaignsDTO from '@application/Campaign/GetAllCampaignsByIssuerDTO';
import GetFavoriteCampaignDTO from '@application/Campaign/GetFavoriteCampaignDTO';
import UpdateCampaignDTO from '@application/Campaign/UpdateCampaignDTO';
import RemoveCampaignDTO from '@application/Campaign/RemoveCampaignDTO';
import PublicOppurtunitiesDTO from '@application/Campaign/PublicOppurtunitiesDTO';
import DetermineCampaignStatusDTO from '@application/Campaign/DetermineCampaignStatusDTO';
import FindCampaignBySlugDTO from '@application/Campaign/FindCampaignBySlugDTO';
import Campaign from '@domain/Core/Campaign/Campaign';
import GetCampaignsWithRepaymentsDTO from './GetCampaignsWithRepaymentsDTO';
import GetCampaignsWithProjectionReturnsDTO from './GetCampaignsWithProjectionReturnsDTO';

export const ICampaignServiceId = Symbol.for('ICampaignService');
type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};

export interface ICampaignService {
  getAllCampaignsByIssuer(getAllCampaignsDTO: GetAllCampaignsDTO): Promise<response>;

  getFavoriteCampaign(getFavoriteCampaignDTO: GetFavoriteCampaignDTO): Promise<response>;

  updateCampaign(updateCampaignDTO: UpdateCampaignDTO): Promise<boolean>;

  removeCampaign(removeCampaignDTO: RemoveCampaignDTO): Promise<boolean>;

  getPublicOppurtunities(
    getPublicOppurtunitiesDTO: PublicOppurtunitiesDTO,
  ): Promise<response>;

  determineCampaignStatus(
    determineCampaignStatusDTO: DetermineCampaignStatusDTO,
  ): Promise<boolean>;

  CampaignExpiredUpdateStatusHandler(): Promise<boolean>;

  LikedCampaigNotifyThirtyDayFromNow(): Promise<boolean>;

  LikedCampaigNotifyOneDayFromNow(): Promise<boolean>;

  updateCampaignStatus(campaign): Promise<boolean>;

  findCampaignBySlug(findCampaignDTO: FindCampaignBySlugDTO): Promise<Campaign>;
  updateNPADocument(campaign: any, issuer: any, signaturePath: any): Promise<any>;
  getAllFCCampaigns(): Promise<any>;
  getCampaignsWithRepayments(getCampaignsWithRepaymentsDTO: GetCampaignsWithRepaymentsDTO): Promise<any>;
  getCampaignsWithProjectionReturns(getCampaignsWithProjectionReturnsDTO: GetCampaignsWithProjectionReturnsDTO): Promise<any>;
}
