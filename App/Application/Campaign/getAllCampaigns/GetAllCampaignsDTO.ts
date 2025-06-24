import { RequestOrigin } from '@domain/Core/ValueObjects/RequestOrigin';
import PaginationOptions from '@domain/Utils/PaginationOptions';
import ParseBoolean from '@infrastructure/Utils/ParseBoolean';

class GetCampaignsDTO {
  investorId: string | undefined;
  showTrashed: boolean;
  campaignStage: string | undefined;
  showFailed: boolean;
  requestOrigin: string;
  paginationOptions: any;
  search: string | number | undefined;
  tags: Array<string>;
  sortBy: string;
  sortPriority: string;

  constructor({
    page,
    perPage,
    campaignStage = undefined,
    investorId = undefined,
    showTrashed = false,
    showFailed = false,
    requestOrigin = 'false',
    search = undefined,
    tags = [],
    sortBy = undefined,
    sortPriority = undefined,
  }) {
    this.investorId = investorId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = ParseBoolean(showTrashed);
    this.campaignStage = campaignStage;
    this.showFailed = ParseBoolean(showFailed);
    this.requestOrigin = requestOrigin;
    this.search = search;
    this.tags = tags;
    this.sortBy = sortBy;
    this.sortPriority = sortPriority;
  }

  getInvestorId() {
    return this.investorId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed;
  }

  isShowFailed() {
    return this.showFailed;
  }

  getSearch() {
    return this.search;
  }

  getCampaignStage() {
    return this.campaignStage;
  }

  isAdminRequest() {
    return this.requestOrigin && this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }

  getTags() {
    return this.tags;
  }

  getSortBy() {
    return this.sortBy;
  }

  getSortPriority() {
    return this.sortPriority;
  }

}

export default GetCampaignsDTO;
