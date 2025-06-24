class ReactivateUserDTO {
  private readonly activationToken: string;

  constructor(activationToken: string) {
    this.activationToken = activationToken;
  }

  getActivationToken() {
    return this.activationToken;
  }
}

export default ReactivateUserDTO;
