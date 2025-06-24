class RemoveCampaignRoughBudgetDTO {
  private readonly roughBudgetId: string;
  private readonly hardDelete: string;

  constructor(roughBudgetId: string, hardDelete: string = 'false') {
    this.roughBudgetId = roughBudgetId;
    this.hardDelete = hardDelete;
  }

  getRoughBudgetId() {
    return this.roughBudgetId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default RemoveCampaignRoughBudgetDTO;
