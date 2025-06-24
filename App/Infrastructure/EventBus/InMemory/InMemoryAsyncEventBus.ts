import EventEmitterBus from '../EventEmitterBus';
import EventSubscriberLocator from '../EventSubscriberLocator';
import Logger from '../../Logger/logger';
import {injectable} from 'inversify';
import {IInMemoryAsyncEventBus} from '@infrastructure/EventBus/InMemory/IInMemoryAsyncEventBus';

@injectable()
class InMemoryAsyncEventBus implements IInMemoryAsyncEventBus {
    private bus;

    constructor() {
        this.start();
    }

    async start() {
        Logger.debug(`[EventBus]: Initializing event bus`);
        const subscribers = await EventSubscriberLocator.getSubscribers();
        this.bus = new EventEmitterBus(subscribers);
        Logger.debug(`[EventBus]: Event bus ready`);
    }

    publish(events) {
        this.bus.publish(events);
    }

    addSubscribers(subscribers) {
        this.bus.registerSubscribers(subscribers);
    }
}

export default InMemoryAsyncEventBus;
