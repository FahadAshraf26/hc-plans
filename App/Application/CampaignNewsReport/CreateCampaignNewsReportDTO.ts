import CampaignNewsReport from '../../Domain/Core/CampaignNewsReport/CampaignNewsReport';

class CreateCampaignNewsReportDTO {
  private campaignNewsReport: any;
  private campaignId: string;

  constructor(campaignNewsId: string, userId: string, campaignId: string, text: string) {
    this.campaignNewsReport = CampaignNewsReport.createFromDetail(
      campaignNewsId,
      userId,
      text,
    );
    this.campaignId = campaignId;
  }

  getCampaignNewsReport() {
    return this.campaignNewsReport;
  }

  getCampaignId() {
    return this.campaignId;
  }
}

export default CreateCampaignNewsReportDTO;
