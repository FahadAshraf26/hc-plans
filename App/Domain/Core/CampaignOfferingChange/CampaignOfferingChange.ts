import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class CampaignOfferingChange extends BaseEntity {
  campaignOfferingChangeId: string;
  private readonly campaignId: string;
  private readonly investorId: string;
  private readonly reconfirmed: boolean;
  constructor(
    campaignOfferingChangeId: string,
    campaignId: string,
    investorId: string,
    reconfirmed: boolean,
  ) {
    super();
    this.campaignOfferingChangeId = campaignOfferingChangeId;
    this.campaignId = campaignId;
    this.investorId = investorId;
    this.reconfirmed = reconfirmed;
  }

  /**
   * @param campaignOfferingChangeObject
   * @returns CampaignOfferingChange
   */
  static createFromObject(
    campaignOfferingChangeObject: CampaignOfferingChange,
  ): CampaignOfferingChange {
    const campaignOfferingChange = new CampaignOfferingChange(
      campaignOfferingChangeObject.campaignOfferingChangeId,
      campaignOfferingChangeObject.campaignId,
      campaignOfferingChangeObject.investorId,
      campaignOfferingChangeObject.reconfirmed,
    );

    if (campaignOfferingChangeObject.createdAt) {
      campaignOfferingChange.setCreatedAt(campaignOfferingChangeObject.createdAt);
    }

    if (campaignOfferingChangeObject.updatedAt) {
      campaignOfferingChange.setUpdatedAt(campaignOfferingChangeObject.updatedAt);
    }

    if (campaignOfferingChangeObject.deletedAt) {
      campaignOfferingChange.setDeletedAT(campaignOfferingChangeObject.deletedAt);
    }

    return campaignOfferingChange;
  }

  /**
   *
   * @param campaignId
   * @param investorId
   * @param reconfirmed
   * @returns CampaignOfferingChange
   */
  static createFromDetail(
    campaignId: string,
    investorId: string,
    reconfirmed: boolean = false,
  ): CampaignOfferingChange {
    return new CampaignOfferingChange(uuid(), campaignId, investorId, reconfirmed);
  }
}

export default CampaignOfferingChange;
