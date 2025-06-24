import { RequestOrigin } from '../../Domain/Core/ValueObjects/RequestOrigin';

class FindCampaignDTO {
  private readonly slug: string;
  private readonly investorId: string;
  private readonly requestOrigin: string;

  constructor(slug: string, investorId: string, requestOrigin: string) {
    this.slug = slug;
    this.investorId = investorId;
    this.requestOrigin = requestOrigin;
  }

  getInvestorId() {
    return this.investorId;
  }

  getSlug() {
    return this.slug;
  }

  isAdminRequest() {
    return this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }
}

export default FindCampaignDTO;
