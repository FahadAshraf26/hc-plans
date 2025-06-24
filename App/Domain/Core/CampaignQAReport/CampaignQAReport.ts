import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignQAReport extends BaseEntity {
  private campaignQAReportId: string;
  text: string;
  campaignQAId: string;
  userId: string;

  constructor(
    campaignQAReportId: string,
    campaignQAId: string,
    userId: string,
    text: string,
  ) {
    super();
    this.campaignQAReportId = campaignQAReportId;
    this.campaignQAId = campaignQAId;
    this.userId = userId;
    this.text = text;
  }

  /**
   * Create CampaignQAReport Object
   * @param {object} campaignQAReportObj
   * @returns CampaignQAReport
   */
  static createFromObject(campaignQAReportObj): CampaignQAReport {
    const campaignQAReport = new CampaignQAReport(
      campaignQAReportObj.campaignQAReportId,
      campaignQAReportObj.campaignQAId,
      campaignQAReportObj.userId,
      campaignQAReportObj.text,
    );

    if (campaignQAReportObj.createdAt) {
      campaignQAReport.setCreatedAt(campaignQAReportObj.createdAt);
    }

    if (campaignQAReportObj.updatedAt) {
      campaignQAReport.setUpdatedAt(campaignQAReportObj.updatedAt);
    }

    if (campaignQAReportObj.deletedAt) {
      campaignQAReport.setDeletedAT(campaignQAReportObj.deletedAt);
    }

    return campaignQAReport;
  }

  /**
   * Create CampaignQAReport Object with Id
   * @returns CampaignQAReport
   * @param campaignQAId
   * @param userId
   * @param text
   */
  static createFromDetail(campaignQAId, userId, text): CampaignQAReport {
    return new CampaignQAReport(uuid(), campaignQAId, userId, text);
  }
}

export default CampaignQAReport;
