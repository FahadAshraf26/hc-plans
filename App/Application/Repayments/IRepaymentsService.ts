import FetchRepaymentsByInvestorIdDTO from './FetchRepaymentsByInvestorIdDTO';
import { FethAllCompletedRepaymentsDTO } from './FetchAllCompletedRepaymentsDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import Repayments from '@domain/Core/Repayments/Repayments';
import UploadProjectionReturnsDTO from '@application/ProjectionReturns/UploadProjectionReturnsDTO';

export const IRepaymentsServiceId = Symbol.for('IRepaymentsService');

export interface IRepaymentsService {
  getInvestorsRepayments(): Promise<any>;
  getRepaymentsByInvestorId(
    fetchRepaymentsByInvestorIdDTO: FetchRepaymentsByInvestorIdDTO,
  ): Promise<any>;
  getAllCompletedRepayments(
    fetchAllCompletedRepaymetsDTO: FethAllCompletedRepaymentsDTO,
  ): Promise<PaginationDataResponse<Repayments>>;
  deleteAllRepayments(
    campaignIds: string[]
  ):Promise<any>;
  uploadRepayments(file: UploadProjectionReturnsDTO): Promise<any>;
  getUploadRepaymentsTemplate(): Promise<any>;
}
