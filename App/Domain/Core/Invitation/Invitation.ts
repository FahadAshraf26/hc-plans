import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class Invitation extends BaseEntity {
  invitationId: string;
  initiator: string;
  private invitee: string;
  private joiningDate: Date;

  constructor(invitationId: string, initiator: string, invitee: string) {
    super();
    this.invitationId = invitationId;
    this.initiator = initiator;
    this.invitee = invitee;
  }

  setJoiningDate(date) {
    this.joiningDate = date;
  }

  static createFromObject(invitationObj) {
    const invitation = new Invitation(
      invitationObj.invitationId,
      invitationObj.initiator,
      invitationObj.invitee,
    );

    if (invitationObj.joiningDate) {
      invitation.setJoiningDate(invitationObj.joiningDate);
    }

    if (invitationObj.createdAt) {
      invitation.setCreatedAt(invitationObj.createdAt);
    }
    if (invitationObj.updatedAt) {
      invitation.setUpdatedAt(invitationObj.updatedAt);
    }

    if (invitationObj.deletedAt) {
      invitation.setDeletedAT(invitationObj.deletedAt);
    }

    return invitation;
  }

  static createFromDetail(initiator, invitee) {
    return new Invitation(uuid(), initiator, invitee);
  }
}

export default Invitation;
