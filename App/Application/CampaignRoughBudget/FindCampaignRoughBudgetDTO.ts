class FindCampaignRoughBudgetDTO {
  private readonly roughBudgetId: string;

  constructor(roughBudgetId: string) {
    this.roughBudgetId = roughBudgetId;
  }

  getRoughBudgetId() {
    return this.roughBudgetId;
  }
}

export default FindCampaignRoughBudgetDTO;
