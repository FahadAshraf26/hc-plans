import CreateCampaignNewsReportDTO from '@application/CampaignNewsReport/CreateCampaignNewsReportDTO';
import GetCampaignNewsReportByCampaignNewsDTO from '@application/CampaignNewsReport/GetCampaignNewsReportByCampaignDTO';

export const ICampaignNewsReportServiceId = Symbol.for('ICampaignNewsReportService');
export interface ICampaignNewsReportService {
  createCampaignNewsReport(
    createCampaignNewsReportDTO: CreateCampaignNewsReportDTO,
  ): Promise<boolean>;
  getCampaignNewsReportByCampaignNews(
    getCampaignNewsReportByCampaignNewsDTO: GetCampaignNewsReportByCampaignNewsDTO,
  ): Promise<any>;
}
