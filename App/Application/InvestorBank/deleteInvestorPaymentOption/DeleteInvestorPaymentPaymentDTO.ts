type deleteInvestorPaymentType = {
  investorPaymentOptionId: string;
  investorId: string;
  hardDelete: string;
  ip: string;
};
class DeleteInvestorPaymentOptionDTO {
  private investorPaymentOptionId: string;
  private hardDelete: string;
  private ip: string;
  private investorId: string;

  constructor({
    investorPaymentOptionId,
    investorId,
    hardDelete,
    ip,
  }: deleteInvestorPaymentType) {
    this.investorPaymentOptionId = investorPaymentOptionId;
    this.hardDelete = hardDelete;
    this.ip = ip;
    this.investorId = investorId;
  }

  getIpAddress(): string {
    return this.ip;
  }

  getInvestorPaymentOptionId(): string {
    return this.investorPaymentOptionId;
  }

  getInvestorId(): string {
    return this.investorId;
  }

  shouldHardDelete(): Boolean {
    return this.hardDelete === 'true';
  }

  static create({ investorPaymentOptionId, investorId, hardDelete, ip }) {
    return new DeleteInvestorPaymentOptionDTO({
      investorPaymentOptionId,
      investorId,
      hardDelete,
      ip,
    });
  }
}

export default DeleteInvestorPaymentOptionDTO;
