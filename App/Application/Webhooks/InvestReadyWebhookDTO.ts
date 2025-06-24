class InvestReadyWebhookDTO {
  private readonly event: any;

  constructor(event: any) {
    this.event = event;
  }

  getReason() {
    return this.event.reason;
  }

  getUserHash() {
    return this.event.userHash;
  }

  getEvent() {
    return this.event;
  }
}

export default InvestReadyWebhookDTO;
