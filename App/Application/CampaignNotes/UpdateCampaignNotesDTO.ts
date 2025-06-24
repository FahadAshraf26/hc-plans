import CampaignNotes from '@domain/Core/CampaignNotes/CampaignNotes';

class UpdateCampaignNotesDTO {
  private readonly notes: CampaignNotes;
  constructor(campaignNotesObj: any) {
    this.notes = CampaignNotes.createFromObject(campaignNotesObj);
  }

  getCampaignId() {
    return this.notes.campaignId;
  }

  getCampaignNotesId() {
    return this.notes.campaignNotesId;
  }

  getCampaignNotes() {
    return this.notes;
  }
}

export default UpdateCampaignNotesDTO;
