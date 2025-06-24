import { UseCase } from '@application/BaseInterface/UseCase';

type DisableIdVerifiedPrompt = {
  userId: string;
};
export const IDisableIdVerifiedPromptUseCaseId = Symbol.for(
  'IDisableIdVerifiedPromptUseCase',
);
export interface IDisableIdVerifiedPromptUseCase
  extends UseCase<DisableIdVerifiedPrompt, boolean> {}
