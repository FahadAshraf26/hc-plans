import uuid from 'uuid/v4';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class EntityAccreditation extends BaseEntity {
  private readonly entityAccreditationId: string;
  private issuerId: string;

  constructor(entityAccreditationId: string) {
    super();
    this.entityAccreditationId = entityAccreditationId;
  }

  static createFromObject(entityAccreditationObj) {
    const entityAccreditation = new EntityAccreditation(
      entityAccreditationObj.entityAccreditationId,
    );
    if (entityAccreditationObj.createdAt) {
      entityAccreditation.setCreatedAt(entityAccreditationObj.createdAt);
    }
    if (entityAccreditationObj.updatedAt) {
      entityAccreditation.setUpdatedAt(entityAccreditationObj.updatedAt);
    }
    if (entityAccreditationObj.deletedAt) {
      entityAccreditation.setDeletedAT(entityAccreditationObj.deletedAt);
    }

    if (entityAccreditationObj.issuerId) {
      entityAccreditation.setIssuerId(entityAccreditationObj.issuerId);
    }

    return entityAccreditation;
  }

  static createFromDetail() {
    return new EntityAccreditation(uuid());
  }
  setIssuerId(issuerId: string) {
    this.issuerId = issuerId;
    return this;
  }
}

export default EntityAccreditation;
