import Invitation from '@domain/Core/Invitation/Invitation';

class CreateInvitationDTO {
  private readonly invitation: Invitation;

  constructor(initiator: string, invitee: string) {
    this.invitation = Invitation.createFromDetail(initiator, invitee);
  }

  getInvitationId() {
    return this.invitation.invitationId;
  }

  getInvitation() {
    return this.invitation;
  }
}

export default CreateInvitationDTO;
