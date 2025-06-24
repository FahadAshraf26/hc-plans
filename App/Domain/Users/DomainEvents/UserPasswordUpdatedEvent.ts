import DomainEvent from '../../Utils/EventBus/DomainEvent';

type userPasswordUpdatedEventType = {
  userId: string;
  email: string;
  eventId?: string;
  occurredOn?: Date;
  firstName?: string;
};

class UserPasswordUpdatedEvent extends DomainEvent {
  static EVENT_NAME = 'user.passwordUpdated';
  email: string;

  constructor({ userId, email, eventId, occurredOn }: userPasswordUpdatedEventType) {
    super(UserPasswordUpdatedEvent.EVENT_NAME, userId, eventId, occurredOn);
    this.email = email;
  }

  toPrimitive() {
    return {
      eventName: UserPasswordUpdatedEvent.EVENT_NAME,
      id: this.aggregateId,
    };
  }

  fromPrimitives(userId: string, body: any, eventId: string, occurredOn: Date) {
    return new UserPasswordUpdatedEvent({
      userId,
      email: body.email,
      eventId,
      occurredOn,
    });
  }
}

export default UserPasswordUpdatedEvent;
