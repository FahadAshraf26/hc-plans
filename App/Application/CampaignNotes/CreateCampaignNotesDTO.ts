import CampaignNotes from '@domain/Core/CampaignNotes/CampaignNotes';

class CreateCampaignNotesDTO {
  private readonly notes: CampaignNotes;
  constructor(campaignId: string, notes: any) {
    this.notes = CampaignNotes.createFromDetail(campaignId, notes);
  }

  getCampaignId() {
    return this.notes.campaignId;
  }

  getCampaignNotes() {
    return this.notes;
  }
}

export default CreateCampaignNotesDTO;
