class FindCampaignNotesDTO {
  private readonly campaignNotesId: string;
  constructor(campaignNotesId: string) {
    this.campaignNotesId = campaignNotesId;
  }

  getCampaignNotesId() {
    return this.campaignNotesId;
  }
}

export default FindCampaignNotesDTO;
