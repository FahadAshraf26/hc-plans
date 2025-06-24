import CreateCampaignQAReportDTO from '@application/CampaignQAReport/CreateCampaignQAReportDTO';
import GetCampaignQAReportByCampaignDTO from '@application/CampaignQAReport/GetCampaignQAReportByCampaignDTO';
import CampaignQAReport from '@domain/Core/CampaignQAReport/CampaignQAReport';

export const ICampaignQAReportServiceId = Symbol.for('ICampaignQAReportService');
type campaignReportResponse = {
  status: string;
  paginationInfo: any;
  data: Array<CampaignQAReport>;
};
export interface ICampaignQAReportService {
  createCampaignQAReport(
    createCampaignQAReportDTO: CreateCampaignQAReportDTO,
  ): Promise<boolean>;
  getCampaignQAReportByCampaignQA(
    getCampaignQAReportByCampaignQADTO: GetCampaignQAReportByCampaignDTO,
  ): Promise<campaignReportResponse>;
}
