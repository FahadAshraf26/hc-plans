class InvestorInvestmentLimitAvailabilityDTO {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }
}

export default InvestorInvestmentLimitAvailabilityDTO;
