import { UseCase } from '@application/BaseInterface/UseCase';
type DisablePortfolioVisitedPrompt = {
  userId: string;
};
export const IDisablePortfolioVisitedPromptUseCaseId = Symbol.for(
  'IDisablePortfolioVisitedPromptUseCase',
);
export interface IDisablePortfolioVisitedPromptUseCase
  extends UseCase<DisablePortfolioVisitedPrompt, boolean> {}
