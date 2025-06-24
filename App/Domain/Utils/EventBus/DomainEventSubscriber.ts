class DomainEventSubscriber {
  static subscribedTo() {
    throw Error('child class needs to implement this');
  }

  static on(domainEvent) {
    throw Error('child class needs to implement this');
  }
}

export default DomainEventSubscriber;
