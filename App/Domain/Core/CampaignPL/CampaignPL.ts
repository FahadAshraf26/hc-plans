import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class PLBudget extends BaseEntity {
  plId: string;
  private pl: any;
  campaignId: string;

  constructor(plId: string, pl: any, campaignId: string) {
    super();
    this.plId = plId;
    this.pl = pl;
    this.campaignId = campaignId;
  }

  /**
   *
   * @param {object} pLObj
   * @returns PLBudget
   */
  static createFromObject(pLObj) {
    const PL = new PLBudget(pLObj.plId, pLObj.pl, pLObj.campaignId);

    if (pLObj.createdAt) {
      PL.setCreatedAt(pLObj.createdAt);
    }
    if (pLObj.updatedAt) {
      PL.setUpdatedAt(pLObj.updatedAt);
    }

    if (pLObj.deletedAt) {
      PL.setDeletedAT(pLObj.deletedAt);
    }

    return PL;
  }

  /**
   *
   * @param {object} pl
   * @param {string} campaignId
   * @returns PL
   */
  static createFromDetail(pl, campaignId) {
    return new PLBudget(uuid(), pl, campaignId);
  }
}

export default PLBudget;
