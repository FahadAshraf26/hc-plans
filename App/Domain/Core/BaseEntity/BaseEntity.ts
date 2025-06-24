class BaseEntity {
  domainEvents: any;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor() {
    this.domainEvents = [];
  }

  pullDomainEvents() {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  record(event) {
    this.domainEvents.push(event);
  }

  /**
   * Set Created Date
   * @param {Date} createdAt
   */
  setCreatedAt(createdAt) {
    this.createdAt = createdAt;
  }

  /**
   * Set Updated Date
   * @param {Date} updatedAt
   */
  setUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
  }

  /**
   * Set Deleted Date
   * @param {Date} deletedAt
   */
  setDeletedAT(deletedAt) {
    this.deletedAt = deletedAt;
  }
}

export default BaseEntity;
