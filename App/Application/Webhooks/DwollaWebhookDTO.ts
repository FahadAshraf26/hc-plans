import DwollaWebhook from '../../Domain/Core/DwollaWebhook';

class DwollaWebhookDTO {
  private readonly dwollaWebhook: DwollaWebhook;

  constructor(event: any) {
    this.dwollaWebhook = DwollaWebhook.createFromDetail(
      event.id,
      event.resourceId,
      event.topic,
    );
  }

  getTopic() {
    return this.dwollaWebhook.topic;
  }

  getEventId() {
    return this.dwollaWebhook.eventId;
  }

  getEvent() {
    return this.dwollaWebhook;
  }
}

export default DwollaWebhookDTO;
