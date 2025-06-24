import UserPasswordUpdatedEvent from '../../../Domain/Users/DomainEvents/UserPasswordUpdatedEvent';
import EmailTemplates from '../../../Domain/Utils/EmailTemplates';
import DomainEventSubscriber from '../../../Domain/Utils/EventBus/DomainEventSubscriber';
import MailService from '@infrastructure/Service/MailService';
import { inject } from 'inversify';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';

const { SendHtmlEmail } = MailService;
const { UserPasswordUpdatedTemplate } = EmailTemplates;

class SendEmailOnUserPasswordUpdatedEvent extends DomainEventSubscriber {
  constructor(
    @inject(IUncaughtExceptionServiceId)
    private uncaughtExceptionService: IUncaughtExceptionService,
  ) {
    super();
  }

  subscribedTo() {
    return [UserPasswordUpdatedEvent];
  }

  async on(domainEvent) {
    const { aggregateId, email, firstName } = domainEvent;
    try {
      const passwordUpdatedHtml = UserPasswordUpdatedTemplate.replace(
        '{@USERNAME}',
        firstName || email,
      );

      await SendHtmlEmail(email, 'Password Updated', passwordUpdatedHtml);
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

export default SendEmailOnUserPasswordUpdatedEvent;
