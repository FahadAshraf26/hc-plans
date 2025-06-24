import uuid from 'uuid/v4';
import BaseEntity from '../BaseEntity/BaseEntity';

class RepaymentsUpdate extends BaseEntity {
  private repaymentsUpdateId: string;
  constructor(repaymentsUpdateId: string) {
    super();
    this.repaymentsUpdateId = repaymentsUpdateId;
  }

  static createFromObject(repaymentsUpdateObj) {
    const repaymentsUpdate = new RepaymentsUpdate(repaymentsUpdateObj.repaymentsUpdateId);
    if (repaymentsUpdateObj.createdAt) {
      repaymentsUpdate.setCreatedAt(repaymentsUpdateObj.createdAt);
    }

    if (repaymentsUpdateObj.updatedAt) {
      repaymentsUpdate.setUpdatedAt(repaymentsUpdateObj.updatedAt);
    }

    if (repaymentsUpdateObj.deletedAt) {
      repaymentsUpdate.setDeletedAT(repaymentsUpdateObj.deletedAt);
    }

    return repaymentsUpdate;
  }

  static createFromDetail() {
    return new RepaymentsUpdate(uuid());
  }
}

export default RepaymentsUpdate;
