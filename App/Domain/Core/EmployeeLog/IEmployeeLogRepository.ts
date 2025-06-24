import { IBaseRepository } from '../BaseEntity/IBaseRepository';
import EmployeeLog from './EmployeeLog';

export const IEmployeeLogRepositoryId = Symbol.for('IEmployeeLogRepository');
export interface IEmployeeLogRepository extends IBaseRepository {
  fetchByIssuerId(issuerId: string): Promise<EmployeeLog>;
}
