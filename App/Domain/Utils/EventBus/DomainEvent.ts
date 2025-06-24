import uuid from 'uuid/v4';

class DomainEvent {
  eventName?: string;
  aggregateId?: string;
  eventId?: string;
  occurredOn?: Date;

  static EVENT_NAME;
  static fromPrimitives(...args) {
    throw Error('child needs to implement this');
  }

  constructor(eventName, aggregateId, eventId, occurredOn) {
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.eventId = eventId || uuid();
    this.occurredOn = occurredOn || new Date();
  }

  toPrimitive() {
    throw Error('child needs to implement this');
  }
}

export default DomainEvent;
