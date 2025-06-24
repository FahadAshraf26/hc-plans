import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignNotes extends BaseEntity {
  campaignNotesId: string;
  campaignId: string;
  private notes: string;

  constructor(campaignNotesId: string, campaignId: string, notes: string) {
    super();
    this.campaignNotesId = campaignNotesId;
    this.campaignId = campaignId;
    this.notes = notes;
  }

  /**
   *
   * @param {object} campaignNotesObj
   * @returns CampaignNotes
   */
  static createFromObject(campaignNotesObj) {
    const campaignNotes = new CampaignNotes(
      campaignNotesObj.campaignNotesId,
      campaignNotesObj.campaignId,
      campaignNotesObj.notes,
    );

    if (campaignNotesObj.createdAt) {
      campaignNotes.setCreatedAt(campaignNotesObj.createdAt);
    }

    if (campaignNotesObj.updatedAt) {
      campaignNotes.setUpdatedAt(campaignNotesObj.updatedAt);
    }

    if (campaignNotesObj.deletedAt) {
      campaignNotes.setDeletedAT(campaignNotesObj.deletedAt);
    }

    return campaignNotes;
  }

  /**
   *
   * @param {string} campaignNotes
   * @returns CampaignNotes
   */
  static createFromDetail(campaignId, notes) {
    return new CampaignNotes(uuid(), campaignId, notes);
  }
}

export default CampaignNotes;
