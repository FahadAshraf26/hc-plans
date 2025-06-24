import PaginationOptions from '@domain/Utils/PaginationOptions';

export class FetchInvestorCampaignProjectionsDTO {
  private paginationOptions: PaginationOptions;
  private investorId: string;
  private campaignId: string;
  private entityId: string;

  constructor(page: number, perPage: number, investorId: string, campaignId: string,entityId: string = null) {
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.investorId = investorId;
    this.campaignId = campaignId;
    this.entityId = entityId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  getInvestorId() {
    return this.investorId;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getEntityId() {
    return this.entityId
  }
}
