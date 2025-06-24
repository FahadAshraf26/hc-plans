export const ICampaignMeetsCriteriaId = Symbol.for('ICampaignMeetsCriteria');
export interface ICampaignMeetsCriteria {
  getSumOfInvestmentGroupByInvestmentType(campaignId): Promise<any>;
  validateCampaignMeetsCriteria(campaign, campaignFundService): Promise<any>;
}
