import uuid from 'uuid/v4';

class EntityCampaignFund{
  private _entityCampaignFundId: string;
  private _campaignFundId: string;
  private _entityId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date;

  constructor(
    entityCampaignFundId: string,
  ){
    this._entityCampaignFundId = entityCampaignFundId;
  }

  static createFromObject(entityCampaignFundObj) {
    const entityCampaignFund = new EntityCampaignFund(
      entityCampaignFundObj.entityCampaignFundId,
    );
    if (entityCampaignFundObj.createdAt) {
      entityCampaignFund.setCreatedAt(entityCampaignFundObj.createdAt);
    }
    if (entityCampaignFundObj.updatedAt) {
      entityCampaignFund.setUpdatedAt(entityCampaignFundObj.updatedAt);
    }
    if (entityCampaignFundObj.deletedAt) {
      entityCampaignFund.setDeletedAT(entityCampaignFundObj.deletedAt);
    }

    if (entityCampaignFundObj.campaignFundId) {
      entityCampaignFund.setCampaignFundId(entityCampaignFundObj.campaignFundId);
    }
    if (entityCampaignFundObj.entityId) {
      entityCampaignFund.setEntityId(entityCampaignFundObj.entityId);
    }
    return entityCampaignFund;
  }

  static createFromDetail() {
    return new EntityCampaignFund(uuid());
  }

  /**
   * @param  {string} campaignFundId
   * @returns EntityCampaignFund
   * @memberof EntityCampaignFund
   * 
   **/
  setCampaignFundId(campaignFundId: string) {
    this._campaignFundId = campaignFundId;
    return this;
  }

  setEntityId(entityId: string) {
    this._entityId = entityId;
    return this;
  }

  setCreatedAt(createdAt: Date) {
    this._createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
    return this;
  }

  setDeletedAT(deletedAt: Date) {
    this._deletedAt = deletedAt;
    return this;
  }
}


export default EntityCampaignFund;