class FundReturnRequestDTO {
  private readonly campaignFundId: string;
  private readonly ip: string;
  private readonly requestedBy: string

  constructor(campaignFundId: string, ip: string, requestedBy: string) {
    this.campaignFundId = campaignFundId;
    this.ip = ip;
    this.requestedBy =  requestedBy
  }

  CampaignFundId() {
    return this.campaignFundId;
  }

  Ip() {
    return this.ip;
  }

  RequestedBy(){
    return this.requestedBy
  }

}

export default FundReturnRequestDTO;
