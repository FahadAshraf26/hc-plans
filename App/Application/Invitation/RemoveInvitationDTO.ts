class RemoveInvitationDTO {
  private readonly invitationId: string;
  private readonly hardDelete: boolean;

  constructor(invitationId: string, hardDelete: boolean = false) {
    this.invitationId = invitationId;
    this.hardDelete = hardDelete;
  }

  getInvitationId() {
    return this.invitationId;
  }

  shouldHardDelete() {
    return this.hardDelete === true;
  }
}

export default RemoveInvitationDTO;
