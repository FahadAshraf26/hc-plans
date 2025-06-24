import UserEvent from '@domain/Core/UserEvent/UserEvent';
import HttpException from '../../Infrastructure/Errors/HttpException';
import { UserEventTypes } from '../../Domain/Core/ValueObjects/UserEventTypes';

class SaveAcknowledgementsDTO {
  private userId: string;
  private readonly acknowledgementEvents: Array<UserEvent>;

  allowedEvents = [
    UserEventTypes.TOS_UPDATE_ACKNOWLEDGED,
    UserEventTypes.PRIVACY_POLICY_UPDATE_ACKNOWLEDGED,
    UserEventTypes.EDUCATION_MATERIAL_UPDATE_ACKNOWLEDGED,
    UserEventTypes.FAQ_UPDATE_ACKNOWLEDGED,
  ];

  constructor(userId, acknowledgements) {
    this.userId = userId;

    if (!Array.isArray(acknowledgements)) {
      throw new HttpException(400, 'invalid request body');
    }

    this.acknowledgementEvents = [];

    acknowledgements.forEach((acknowledgementType) => {
      if (!this.allowedEvents.includes(acknowledgementType)) {
        throw new HttpException(400, 'invalid acknowledgement type');
      }

      this.acknowledgementEvents.push(
        UserEvent.createFromDetail(userId, acknowledgementType),
      );
    });
  }

  getAcknowledgementEvents() {
    return this.acknowledgementEvents;
  }
}

export default SaveAcknowledgementsDTO;
