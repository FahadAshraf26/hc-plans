import DomainEvent from '../../Utils/EventBus/DomainEvent';

type userEmailUpdatedEventType = {
  userId: string;
  user?: any;
  eventId?: string;
  occurredOn?: Date;
};

class UserEmailUpdatedEvent extends DomainEvent {
  user?: any;
  static EVENT_NAME = 'user.emailUpdated';

  constructor({ userId, user, eventId, occurredOn }: userEmailUpdatedEventType) {
    super(UserEmailUpdatedEvent.EVENT_NAME, userId, eventId, occurredOn);
    this.user = user;
  }

  toPrimitive() {
    return {
      eventName: UserEmailUpdatedEvent.EVENT_NAME,
      id: this.aggregateId,
    };
  }

  fromPrimitives(userId: string, body: any, eventId: string, occurredOn: Date) {
    return new UserEmailUpdatedEvent({
      userId,
      user: body.user,
      eventId,
      occurredOn,
    });
  }
}

export default UserEmailUpdatedEvent;
