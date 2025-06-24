import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import UserKYCVerifiedEvent from '@domain/Users/DomainEvents/UserKYCVerifiedEvent';
import DomainEventSubscriber from '@domain/Utils/EventBus/DomainEventSubscriber';
// import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { inject } from 'inversify';

class CreateNorthCapitalAccountOnUserKYCVerifiedEvent extends DomainEventSubscriber {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IUncaughtExceptionServiceId)
    private uncaughtExceptionService: IUncaughtExceptionService,
  ) {
    super();
  }

  subscribedTo() {
    return [UserKYCVerifiedEvent];
  }

  async on(domainEvent) {
    const { aggregateId } = domainEvent;
    const user = await this.userRepository.fetchById(aggregateId);

    if (!user) {
      return;
    }

    try {
      if (user.NcPartyId() && user.NcAccountId()) {
        return;
      }
      // (await northCapitalService.createParty(user));
      // (await northCapitalService.createAccount(user));
      const ncPartyId = user.NcPartyId();
      const ncAccountId = user.NcAccountId();
      user.setNorthCapitalPartyId(ncPartyId);
      user.investor.setNorthCapitalAccountId(ncAccountId);
      await Promise.all([
        // await northCapitalService.performAML({ partyId: ncPartyId }),
        await this.userRepository.update(user),
        // await northCapitalService.calculateSuitability(ncAccountId),
        // await northCapitalService.createLink({
        //   firstEntityType: 'Account',
        //   firstEntityId: ncAccountId,
        //   relatedEntityType: 'IndivACParty',
        //   relatedEntityId: ncPartyId,
        // }),
      ]);

      return true;
    } catch (err) {
      await this.uncaughtExceptionService.logException(
        {
          userId: user.userId,
          email: user.email,
          eventName: domainEvent.eventName,
        },
        err,
      );
    }
  }
}

export default CreateNorthCapitalAccountOnUserKYCVerifiedEvent;
