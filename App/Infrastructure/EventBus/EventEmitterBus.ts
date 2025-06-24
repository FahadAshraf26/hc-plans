import EventEmitter from 'events';

class EventEmitterBus extends EventEmitter {
  constructor(subscribers) {
    super();
    this.registerSubscribers(subscribers);
  }

  registerSubscribers(subscribers) {
    subscribers.forEach((subscriber) => {
      this.registerSubscriber(subscriber);
    });
  }

  registerSubscriber(subscriber) {
    subscriber.subscribedTo().forEach((event) => {
      this.on(event.EVENT_NAME, subscriber.on.bind(subscriber));
    });
  }

  publish(events) {
    events.forEach((event) => this.emit(event.eventName, event));
  }
}

export default EventEmitterBus;
