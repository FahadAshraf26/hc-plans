import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetCampaignInvestmentsReportDTO {
  private readonly showTrashed: string;
  private inculdePending: boolean;
  private readonly query: any;

  constructor(
    showTrashed: string = 'false',
    inculdePending: boolean = false,
    query = '',
  ) {
    this.showTrashed = showTrashed;
    this.inculdePending = inculdePending;
    this.query = query;
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

export default GetCampaignInvestmentsReportDTO;
