class DeactivateUserDTO {
  private userId: string;
  private hardDelete: string;

  constructor(userId: string, hardDelete: string = 'false') {
    this.userId = userId;
    this.hardDelete = hardDelete;
  }

  UserId(): string {
    return this.userId;
  }

  shouldHardDelete(): boolean {
    return this.hardDelete === 'true';
  }
}

export default DeactivateUserDTO;
