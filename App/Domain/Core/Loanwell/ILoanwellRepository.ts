import { IBaseRepository } from '../BaseEntity/IBaseRepository';

export const ILoanwellRepositoryId = Symbol.for('ILoanwellRepository');

export interface ILoanwellRepository extends IBaseRepository {}
