import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignInvestmentsDTO {
  private readonly campaignId: string;
  private readonly paginationOptions: PaginationOptions;
  private readonly showTrashed: string;
  private inculdePending: boolean;
  private readonly query: any;

  constructor(
    campaignId: string,
    page: number,
    perPage: number,
    showTrashed: string = 'false',
    inculdePending: boolean = false,
    query = '',
  ) {
    this.campaignId = campaignId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.inculdePending = inculdePending;
    this.query = query;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === 'true';
  }

  isIncludePending() {
    return (this.inculdePending = !!'true');
  }

  getQuery() {
    return this.query;
  }
}

export default GetCampaignInvestmentsDTO;
