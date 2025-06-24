class IdologyWebhookDTO {
  private readonly data: any;

  constructor(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

export default IdologyWebhookDTO;
