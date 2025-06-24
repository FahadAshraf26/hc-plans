import DomainEvent from '../../Utils/EventBus/DomainEvent';

type userKYCVerifiedEventType = {
  userId: string;
  eventId?: string;
  occurredOn?: Date;
};

class UserKYCVerifiedEvent extends DomainEvent {
  static EVENT_NAME = 'user.kycVerified';

  constructor({ userId, eventId, occurredOn }: userKYCVerifiedEventType) {
    super(UserKYCVerifiedEvent.EVENT_NAME, userId, eventId, occurredOn);
  }

  toPrimitive() {
    return {
      eventName: UserKYCVerifiedEvent.EVENT_NAME,
      id: this.aggregateId,
    };
  }

  fromPrimitives(userId: string, eventId: string, occurredOn: Date) {
    return new UserKYCVerifiedEvent({
      userId,
      eventId,
      occurredOn,
    });
  }
}

export default UserKYCVerifiedEvent;
