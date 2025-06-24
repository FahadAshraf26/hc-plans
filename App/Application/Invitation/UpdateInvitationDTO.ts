import Invitation from '@domain/Core/Invitation/Invitation';

class UpdateInvitationDTO {
  private readonly invitation: Invitation;
  constructor(invitationObj) {
    this.invitation = Invitation.createFromObject(invitationObj);
  }

  getInitiatorId() {
    return this.invitation.initiator;
  }

  getInvitationId() {
    return this.invitation.invitationId;
  }

  getInvitation() {
    return this.invitation;
  }
}

export default UpdateInvitationDTO;
