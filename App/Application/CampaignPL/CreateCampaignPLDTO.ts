import PL from '@domain/Core/CampaignPL/CampaignPL';

class CreateCampaignPLDTO {
  private readonly pl: PL;

  constructor(pl: any, campaignId: string) {
    this.pl = PL.createFromDetail(pl, campaignId);
  }

  getCampaignId() {
    return this.pl.campaignId;
  }

  getPL() {
    return this.pl;
  }
}

export default CreateCampaignPLDTO;
