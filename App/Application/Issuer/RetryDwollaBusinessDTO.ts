class RetryBusinessDwollaDTO {
  private customerId: string;

  constructor(customerId: string) {
    this.customerId = customerId;
  }

  getCustomerId(): string {
    return this.customerId;
  }
}

export default RetryBusinessDwollaDTO;
