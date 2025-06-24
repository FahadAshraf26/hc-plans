import { EventEmitter } from '@infrastructure/EventBus/EventEmitter';
import User from '@domain/Core/User/User';
import { ICreateNCAccount } from './ICreateNCAccount';
import { ICreateUSAEPayAccount } from './ICreateUSAEPayAccount';
import { ICreateStripeAccount } from './ICreateStripeAccount';

type EventMap = {
  createNCUser: [user: User];
  createUSAEpayUser: [user: User];
  createStripeUser: [user: User];
  createDwollaUser: [user: User];
};
export const UserEventHandler = (
  createNCAccount: ICreateNCAccount,
  createUSAEPayAccount: ICreateUSAEPayAccount,
  createStripeAccount: ICreateStripeAccount,
) => {
  const userEventHandler = new EventEmitter<EventMap>();
  userEventHandler.on('createNCUser', async (user: User) => {
    await createNCAccount.createUserPartyAndAccount(user);
  });
  userEventHandler.on('createUSAEpayUser', async (user: User) => {
    if(!user.vcCustomerId){
      await createUSAEPayAccount.createFirstCitizenBankCustomer(user);
    }
    if(!user.vcThreadBankCustomerId){
      await createUSAEPayAccount.createThreadBankCustomer(user);
    }
  });
  userEventHandler.on('createStripeUser', async (user: User) => {
    await createStripeAccount.createCustomer(user);
  });
  return userEventHandler;
};
