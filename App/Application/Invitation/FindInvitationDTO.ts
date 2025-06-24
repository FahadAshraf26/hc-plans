class FindInvitationDTO {
  private readonly invitationId: string;

  constructor(invitationId: string) {
    this.invitationId = invitationId;
  }

  getInvitationId() {
    return this.invitationId;
  }
}

export default FindInvitationDTO;
