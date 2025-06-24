import { UseCase } from '@application/BaseInterface/UseCase';
import User from '@domain/Core/User/User';

export const ISendEmailVerificationLinkUseCaseId = Symbol.for(
  'ISendEmailVerificationLinkUseCase',
);

export interface ISendEmailVerificationLinkUseCase
  extends UseCase<{ user: User }, boolean> {}
