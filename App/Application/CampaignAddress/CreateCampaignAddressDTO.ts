import CampaignAddress from '@domain/Core/CampaignAddress/CampaignAddress';

class CreateCampaignAddressDTO {
  private readonly campaignId: string;
  private readonly isCampaignAddress: boolean;
  private readonly campaignAddress: any;

  constructor(campaignId: string, campaignAddressProps) {
    this.campaignId = campaignId;
    this.isCampaignAddress = campaignAddressProps.isCampaignAddress;
    this.campaignAddress = CampaignAddress.createFromDetail(
      campaignAddressProps,
      campaignId,
    );
  }

  getCampaignId() {
    return this.campaignId;
  }

  getIsCampaignAddress() {
    return this.isCampaignAddress;
  }

  getCampaignAddress() {
    return this.campaignAddress;
  }
}

export default CreateCampaignAddressDTO;
