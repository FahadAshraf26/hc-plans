import CampaignQAReport from '../../Domain/Core/CampaignQAReport/CampaignQAReport';

class CreateCampaignQAReportDTO {
  private campaignId: string;
  private campaignQAReport: CampaignQAReport;

  constructor(campaignQAId: string, userId: string, campaignId: string, text: string) {
    this.campaignQAReport = CampaignQAReport.createFromDetail(campaignQAId, userId, text);
    this.campaignId = campaignId;
  }

  getCampaignQAReport() {
    return this.campaignQAReport;
  }

  getCampaignId() {
    return this.campaignId;
  }
}

export default CreateCampaignQAReportDTO;
