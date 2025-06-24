import CampaignNews from '@domain/Core/CampaignNews/CampaignNews';
import GetCampaignNewsDTO from '@application/CampaignNews/GetCampaignNewsDTO';
import FindCampaignNewsDTO from '@application/CampaignNews/FindCampaignNewsDTO';
import UpdateCampaignNewsDTO from '@application/CampaignNews/UpdateCampaignNewsDTO';
import RemoveCampaignNewsDTO from '@application/CampaignNews/RemoveCampaignNewsDTO';
import CreateCampaignNewsDTO from '@application/CampaignNews/CreateCampaignNewsDTO';

export const ICampaignNewsServiceId = Symbol.for('ICampaignNewsService');
export interface ICampaignNewsService {
  getCampaignNews(getCampaignNewsDTO: GetCampaignNewsDTO): Promise<any>;
  findCampaignNews(findCampaignNewsDTO: FindCampaignNewsDTO): Promise<CampaignNews>;
  updateCampaignNews(updateCampaignNews: UpdateCampaignNewsDTO): Promise<boolean>;
  removeCampaignNews(removeCampaignNewsDTO: RemoveCampaignNewsDTO): Promise<boolean>;
  createCampaignNews(createCampaignNewsDTO: CreateCampaignNewsDTO): Promise<boolean>;
  sendBusinessUpdateEmailToInvestor(
    campaignId: string,
    campaignNewsId: string,
    campaignNews: any,
  ): Promise<any>;
  sendBusinessUpdateEmailToInterestedInvestor(
    campaignId: string,
    campaignNewsId: string,
    campaignNews: any,
  ): Promise<any>;
}
