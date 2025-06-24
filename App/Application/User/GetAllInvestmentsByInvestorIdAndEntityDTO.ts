class GetAllInvestmentsByInvestorIdAndEntityDTO {
  private userId: string;
  private entityId: string;
  constructor(userId: string, enityId: string) {
    this.userId = userId;
    this.entityId = this.entityId;
  }

  getUserId() {
    return this.userId;
  }

  getEntityId() {
    return this.entityId;
  }
}

export default GetAllInvestmentsByInvestorIdAndEntityDTO;
