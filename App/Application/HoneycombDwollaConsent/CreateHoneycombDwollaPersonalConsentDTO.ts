class CreateHoneycombDwollaPersonalConsentDTO {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }
}

export default CreateHoneycombDwollaPersonalConsentDTO;
