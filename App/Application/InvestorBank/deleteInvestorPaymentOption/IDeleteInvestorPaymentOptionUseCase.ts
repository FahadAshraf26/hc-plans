import { UseCase } from '@application/BaseInterface/UseCase';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import DeleteInvestorPaymentOptionDTO from './DeleteInvestorPaymentPaymentDTO';

export const IDeleteInvestorPaymentOptionUseCaseId = Symbol.for(
  'IDeleteInvestorPaymentOptionUseCase',
);

export interface IDeleteInvestorPaymentOptionUseCase
  extends UseCase<DeleteInvestorPaymentOptionDTO, boolean> {}
