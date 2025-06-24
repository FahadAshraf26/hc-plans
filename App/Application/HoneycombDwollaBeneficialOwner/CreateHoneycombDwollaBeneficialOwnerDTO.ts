class CreateHoneycombDwollaBeneficialOwnerDTO {
  private issuerId: string;

  constructor(issuerId: string) {
    this.issuerId = issuerId;
  }

  getIssuerId(): string {
    return this.issuerId;
  }
}

export default CreateHoneycombDwollaBeneficialOwnerDTO;
