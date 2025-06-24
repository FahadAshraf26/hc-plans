import uuid from 'uuid/v4';
import { ChargeStatus } from './ValueObjects/ChargeStatus';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';

class DwollaWebhook extends BaseEntity {
  private dwollaWebhookId: string;
  eventId: string;
  private readonly resourceId: string;
  topic: any;
  private status: string;

  constructor(
    dwollaWebhookId: string,
    eventId: string,
    resourceId: string,
    topic: any,
    status: string,
  ) {
    super();
    this.dwollaWebhookId = dwollaWebhookId;
    this.eventId = eventId;
    this.resourceId = resourceId;
    this.topic = topic;
    this.status = status;
  }

  getResourceId() {
    return this.resourceId;
  }

  setStatus(status) {
    this.status = status;
  }

  /**
   * Create DwollaWebhook Object
   * @param {object} dwollaWebhookObj
   * @returns DwollaWebhook
   */
  static createFromObject(dwollaWebhookObj) {
    const dwollaWebhook = new DwollaWebhook(
      dwollaWebhookObj.dwollaWebhookId,
      dwollaWebhookObj.eventId,
      dwollaWebhookObj.resourceId,
      dwollaWebhookObj.topic,
      dwollaWebhookObj.status,
    );

    if (dwollaWebhookObj.createdAt) {
      dwollaWebhook.setCreatedAt(dwollaWebhookObj.createdAt);
    }

    if (dwollaWebhookObj.updatedAt) {
      dwollaWebhook.setUpdatedAt(dwollaWebhookObj.updatedAt);
    }

    if (dwollaWebhookObj.deletedAt) {
      dwollaWebhook.setDeletedAT(dwollaWebhookObj.deletedAt);
    }

    return dwollaWebhook;
  }

  /**
   * Create DwollaWebhook Object with Id
   * @param {string} eventId
   * @param {string} resourceId
   * @param {string} topic
   * @param {string} status
   * @returns DwollaWebhook
   */
  static createFromDetail(eventId, resourceId, topic, status = ChargeStatus.PENDING) {
    return new DwollaWebhook(uuid(), eventId, resourceId, topic, status);
  }

  getStatus() {
    return this.status;
  }
}

export default DwollaWebhook;
