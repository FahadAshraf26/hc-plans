import { UseCase } from '@application/BaseInterface/UseCase';

export const IUpdateUserPasswordUseCaseId = Symbol.for('IUpdateUserPasswordUseCase');

export interface IUpdateUserPasswordUseCase
  extends UseCase<{ userId: string; password: string; ip: string }, any> {}
