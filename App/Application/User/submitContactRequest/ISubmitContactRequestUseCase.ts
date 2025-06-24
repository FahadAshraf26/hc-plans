import { UseCase } from '@application/BaseInterface/UseCase';

export const ISubmitContactRequestUseCaseId = Symbol.for('ISubmitContactRequestUseCase');
type SubmitContactRequest = { email: string; text: string };
export interface ISubmitContactRequestUseCase
  extends UseCase<SubmitContactRequest, boolean> {}
