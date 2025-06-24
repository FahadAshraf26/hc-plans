import { UseCase } from '@application/BaseInterface/UseCase';

type totalInvestedAmount = {
  userId: string;
};
type totalInvestedAmountResponse = {
  totalInvested: number;
};
export const ITotalInvestedAmountUseCaseId = Symbol.for('ITotalInvestedAmountUseCase');
export interface ITotalInvestedAmountUseCase
  extends UseCase<totalInvestedAmount, totalInvestedAmountResponse> {}
