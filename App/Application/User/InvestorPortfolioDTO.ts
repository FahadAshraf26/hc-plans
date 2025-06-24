class InvestorPortfolioDTO {
  private readonly userId: string;
  private readonly entityId: string;
  constructor(userId: string, entityId: string = null) {
    this.userId = userId;
    this.entityId = entityId;
  }

  getUserId(): string {
    return this.userId;
  }

  getEntityId(): string {
    return this.entityId;
  }
}

export default InvestorPortfolioDTO;
