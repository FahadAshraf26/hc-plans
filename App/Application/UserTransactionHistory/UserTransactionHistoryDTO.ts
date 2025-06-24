
class UserTransactionHistoryDTO {
  private investorId: string;
  private entityId: string;

  constructor(investorId: string,entityId = null) {
    this.investorId = investorId;
    this.entityId = entityId;
  }

  getInvestorId() {
    return this.investorId;
  }

  getEntityId() {
    return this.entityId;
  }
}

export default UserTransactionHistoryDTO;