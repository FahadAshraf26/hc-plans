class UdpateCampaignAddressDTO {
  private readonly campaignId: string;
  private readonly campaignAddressId: string;
  private readonly campaignAddressProps: any;
  private readonly isCampaignAddress: boolean;

  constructor(campaignId: string, campaignAddressId: string, campaignAddressProps: any) {
    this.campaignId = campaignId;
    this.campaignAddressId = campaignAddressId;
    this.campaignAddressProps = campaignAddressProps;
    this.isCampaignAddress = campaignAddressProps.isCampaignAddress;
  }

  getCampaignId() {
    return this.campaignId;
  }

  getCampaignAddressId() {
    return this.campaignAddressId;
  }

  getCampaignAddress() {
    return this.campaignAddressProps;
  }

  getIsCampaignAddress() {
    return this.isCampaignAddress;
  }
}

export default UdpateCampaignAddressDTO;
