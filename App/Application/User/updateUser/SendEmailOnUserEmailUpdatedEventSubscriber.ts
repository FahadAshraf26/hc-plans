import UserEmailUpdatedEvent from '../../../Domain/Users/DomainEvents/UserEmailUpdatedEvent';
import DomainEventSubscriber from '../../../Domain/Utils/EventBus/DomainEventSubscriber';
import { inject } from 'inversify';
import {
  ISendEmailVerificationLinkUseCase,
  ISendEmailVerificationLinkUseCaseId,
} from '@application/User/sendEmailVerificationLink/ISendEmailVerificationLinkUseCase';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';
import email from '@infrastructure/Config/email';

class SendEmailOnUserEmailUpdatedEvent extends DomainEventSubscriber {
  constructor(
    @inject(ISendEmailVerificationLinkUseCaseId)
    private sendEmailVerificationLinkUseCase: ISendEmailVerificationLinkUseCase,
    @inject(IUncaughtExceptionServiceId)
    private uncaughtExceptionService: IUncaughtExceptionService,
  ) {
    super();
  }

  subscribedTo() {
    return [UserEmailUpdatedEvent];
  }

  async on(domainEvent) {
    const { aggregateId, user } = domainEvent;
    try {
      await this.sendEmailVerificationLinkUseCase.execute({ user });
    } catch (err) {
      await this.uncaughtExceptionService.logException(
        {
          userId: aggregateId,
          email,
          eventName: domainEvent.eventName,
        },
        err,
      );
    }
  }
}

export default SendEmailOnUserEmailUpdatedEvent;
