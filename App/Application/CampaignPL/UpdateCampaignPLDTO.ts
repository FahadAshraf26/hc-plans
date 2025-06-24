import PL from '@domain/Core/CampaignPL/CampaignPL';

class UpdateCampaignPLDTO {
  private readonly pl: PL;

  constructor(PLObj: any) {
    this.pl = PL.createFromObject(PLObj);
  }

  getCampaignId() {
    return this.pl.campaignId;
  }

  getPLId() {
    return this.pl.plId;
  }

  getPL() {
    return this.pl;
  }
}

export default UpdateCampaignPLDTO;
