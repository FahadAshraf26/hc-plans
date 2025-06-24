import { UseCase } from '@application/BaseInterface/UseCase';
import SummaryDTO from '@application/User/summary/SummaryDTO';

export const ISummaryUseCaseId = Symbol.for('ISummaryUseCase');
export interface ISummaryUseCase extends UseCase<SummaryDTO, any> {}
