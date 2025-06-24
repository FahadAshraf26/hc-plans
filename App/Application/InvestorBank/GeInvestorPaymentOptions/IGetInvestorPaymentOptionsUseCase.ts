import GetInvestorPaymentOptionsDTO from './GetInvestorPaymentOptionsDTO';
import { UseCase } from '@application/BaseInterface/UseCase';
import PaginationData from '@domain/Utils/PaginationData';

type responseType = {
  status: string;
  paginationInfo: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    nextPage: number;
    prevPage: number;
  };
  data: any[];
};

export const IGetInvestorPaymentOptionsUseCaseId = Symbol.for(
  'IGetInvestorPaymentOptionsUseCase',
);

export interface IGetInvestorPaymentOptionsUseCase
  extends UseCase<GetInvestorPaymentOptionsDTO, responseType> {}
