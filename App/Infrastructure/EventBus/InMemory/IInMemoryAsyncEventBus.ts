export const IInMemoryAsyncEventBusId = Symbol.for('IInMemoryAsyncEventBus');

export interface IInMemoryAsyncEventBus {
  start(): Promise<void>;

  publish(events: any): void;

  addSubscribers(subscribers: any): void;
}
