class CreateHoneycombDwollaBusinessConsentsDTO {
  private issuerId: string;
  private businessClassificationId: string;
  private email: string;
  private userEmail: string;
  constructor(
    issuerId: string,
    businessClassificationId: string,
    email: string,
    userEmail: string,
  ) {
    this.issuerId = issuerId;
    this.businessClassificationId = businessClassificationId;
    this.email = email;
    this.userEmail = userEmail;
  }

  getIssuerId() {
    return this.issuerId;
  }

  getBusinessClassificationId() {
    return this.businessClassificationId;
  }

  getEmail() {
    return this.email;
  }

  getUserEmail() {
    return this.userEmail;
  }
}

export default CreateHoneycombDwollaBusinessConsentsDTO;
