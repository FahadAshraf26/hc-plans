import { IBaseRepository } from '../BaseEntity/IBaseRepository';

export const IExportDataRepositoryId = Symbol.for('IExportDataRepository');

export interface IExportDataRepository extends IBaseRepository {
  fetchAllExports(paginationOptions): Promise<any>;
}
