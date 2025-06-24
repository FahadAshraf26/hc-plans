import { RequestOrigin } from '@domain/Core/ValueObjects/RequestOrigin';

class FindCampaignDTO {
  campaignId: string;
  requestOrigin?: string;
  investorId?: string;

  constructor(campaignId: string, requestOrigin?: string, investorId?: string) {
    this.campaignId = campaignId;
    this.requestOrigin = requestOrigin;
    this.investorId = investorId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  isAdminRequest() {
    return this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }

  getInvestorId() {
    return this.investorId;
  }
}

export default FindCampaignDTO;
