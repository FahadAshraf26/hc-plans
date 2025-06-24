class DeleteUserMediaDTO {
  private readonly userMediaId: string;
  private readonly hardDelete: string;

  constructor(userMediaId?, hardDelete?) {
    this.userMediaId = userMediaId;
    this.hardDelete = hardDelete;
  }

  getUserMediaId() {
    return this.userMediaId;
  }

  shouldHardDelete() {
    return typeof this.hardDelete === 'string'
      ? this.hardDelete === 'true'
      : this.hardDelete;
  }
}

export default DeleteUserMediaDTO;
