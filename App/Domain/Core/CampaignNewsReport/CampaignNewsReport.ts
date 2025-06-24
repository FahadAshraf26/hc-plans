import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignNewsReport extends BaseEntity {
  private campaignNewsReportId: string;
  private campaignNewsId: string;
  private userId: string;
  private text: string;

  constructor(
    campaignNewsReportId: string,
    campaignNewsId: string,
    userId: string,
    text: string,
  ) {
    super();
    this.campaignNewsReportId = campaignNewsReportId;
    this.campaignNewsId = campaignNewsId;
    this.userId = userId;
    this.text = text;
  }

  /**
   * Create CampaignNewsReport Object
   * @param {object} campaignNewsReportObj
   * @returns CampaignNewsReport
   */
  static createFromObject(campaignNewsReportObj): CampaignNewsReport {
    const campaignNewsReport = new CampaignNewsReport(
      campaignNewsReportObj.campaignNewsReportId,
      campaignNewsReportObj.campaignNewsId,
      campaignNewsReportObj.userId,
      campaignNewsReportObj.text,
    );

    if (campaignNewsReportObj.createdAt) {
      campaignNewsReport.setCreatedAt(campaignNewsReportObj.createdAt);
    }

    if (campaignNewsReportObj.updatedAt) {
      campaignNewsReport.setUpdatedAt(campaignNewsReportObj.updatedAt);
    }

    if (campaignNewsReportObj.deletedAt) {
      campaignNewsReport.setDeletedAT(campaignNewsReportObj.deletedAt);
    }

    return campaignNewsReport;
  }

  /**
   * Create CampaignNewsReport Object with Id
   * @returns CampaignNewsReport
   * @param campaignNewsId
   * @param userId
   * @param text
   */
  static createFromDetail(
    campaignNewsId: string,
    userId: string,
    text: string,
  ): CampaignNewsReport {
    return new CampaignNewsReport(uuid(), campaignNewsId, userId, text);
  }
}

export default CampaignNewsReport;
