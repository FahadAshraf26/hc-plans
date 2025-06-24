import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class CampaignRoughBudget extends BaseEntity {
  roughBudgetId: string;
  private roughBudget: any;
  campaignId: string;

  constructor(roughBudgetId: string, roughBudget: any, campaignId: string) {
    super();
    this.roughBudgetId = roughBudgetId;
    this.roughBudget = roughBudget;
    this.campaignId = campaignId;
  }

  /**
   *
   * @param {object} roughBudgetObj
   * @returns CampaignRoughBudget
   */
  static createFromObject(roughBudgetObj) {
    const roughBudget = new CampaignRoughBudget(
      roughBudgetObj.roughBudgetId,
      roughBudgetObj.roughBudget,
      roughBudgetObj.campaignId,
    );

    if (roughBudgetObj.createdAt) {
      roughBudget.setCreatedAt(roughBudgetObj.createdAt);
    }
    if (roughBudgetObj.updatedAt) {
      roughBudget.setUpdatedAt(roughBudgetObj.updatedAt);
    }

    if (roughBudgetObj.deletedAt) {
      roughBudget.setDeletedAT(roughBudgetObj.deletedAt);
    }

    return roughBudget;
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @param {string} total
   * @param {string} campaignId
   * @returns CampaignRoughBudget
   */
  static createFromDetail(roughBudget, campaignId) {
    return new CampaignRoughBudget(uuid(), roughBudget, campaignId);
  }
}

export default CampaignRoughBudget;
