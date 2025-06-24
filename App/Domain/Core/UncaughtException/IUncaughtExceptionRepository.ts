import PaginationData from '../../Utils/PaginationData';
import UncaughtException from './UncaughtException';
import PaginationOptions from '../..//Utils/PaginationOptions';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IUncaughtExceptionRepositoryId = Symbol.for('IUncaughtExceptionRepository');

type uncaughtExceptionOptions = {
  paginationOptions: PaginationOptions;
  showTrashed?: boolean;
  query?: string;
};

export interface IUncaughtExceptionRepository extends IBaseRepository {
  fetchAll(options: uncaughtExceptionOptions): Promise<PaginationData<UncaughtException>>;
  fetchAllExceptions(
    options: uncaughtExceptionOptions,
  ): Promise<PaginationData<UncaughtException>>;
}
