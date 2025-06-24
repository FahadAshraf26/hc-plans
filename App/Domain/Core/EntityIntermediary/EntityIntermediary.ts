import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class EntityIntermediary extends BaseEntity {
  private readonly entityIntermediaryId: string;
  private userId: string;
  private issuerId: string;
  private operatorAgreementApproved: boolean;
  private intermediaryName: string;

  constructor(entityIntermediaryId: string) {
    super();
    this.entityIntermediaryId = entityIntermediaryId;
  }

  static createFromObject(entityIntermediaryObj) {
    const entityIntermediary = new EntityIntermediary(
      entityIntermediaryObj.entityIntermediaryId,
    );
    if (entityIntermediaryObj.createdAt) {
      entityIntermediary.setCreatedAt(entityIntermediaryObj.createdAt);
    }
    if (entityIntermediaryObj.updatedAt) {
      entityIntermediary.setUpdatedAt(entityIntermediaryObj.updatedAt);
    }
    if (entityIntermediaryObj.deletedAt) {
      entityIntermediary.setDeletedAT(entityIntermediaryObj.deletedAt);
    }

    if (entityIntermediaryObj.userId) {
      entityIntermediary.setUserId(entityIntermediaryObj.userId);
    }
    if (entityIntermediaryObj.issuerId) {
      entityIntermediary.setIssuerId(entityIntermediaryObj.issuerId);
    }
    if (entityIntermediaryObj.operatorAgreementApproved) {
      entityIntermediary.setOperatorAgreementApproved(
        entityIntermediaryObj.operatorAgreementApproved,
      );
    }

    if(entityIntermediaryObj.intermediaryName) {
      entityIntermediary.setIntermediaryName(entityIntermediaryObj.intermediaryName);
    }
    
    return entityIntermediary;
  }

  static createFromDetail() {
    return new EntityIntermediary(uuid());
  }

  /**
   * @param  {string} userId
   */
  setUserId(userId: string) {
    this.userId = userId;
    return this;
  }

  /**
   * @param  {string} issuerId
   */
  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
    return this;
  }

  /**
   * @param  {boolean} operatorAgreementApproved
   */
  setOperatorAgreementApproved(operatorAgreementApproved: boolean) {
    this.operatorAgreementApproved = !!operatorAgreementApproved;
    return this;
  }

  setIntermediaryName(intermediaryName: string) {
    this.intermediaryName = intermediaryName;
    return this;
  }
}

export default EntityIntermediary;
