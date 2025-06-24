import { UseCase } from '@application/BaseInterface/UseCase';

type submitFeedbackUseCaseDTOType = {
  email: string;
  text: string;
};
export const ISubmitFeedbackUseCaseId = Symbol.for('ISubmitFeedbackUseCase');

export interface ISubmitFeedbackUseCase
  extends UseCase<submitFeedbackUseCaseDTOType, boolean> {}
