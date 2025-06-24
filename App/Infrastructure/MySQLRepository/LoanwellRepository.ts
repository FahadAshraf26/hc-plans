import { ILoanwellRepository } from '@domain/Core/Loanwell/ILoanwellRepository';
import BaseRepository from './BaseRepository';
import Model from '@infrastructure/Model';
import Loanwell from '@domain/Core/Loanwell/Loanwell';
import { injectable } from 'inversify';
import PaginationData from '@domain/Utils/PaginationData';

const { LoanwellModel } = Model;

@injectable()
class LoanwellRepository extends BaseRepository implements ILoanwellRepository {
  constructor() {
    super(LoanwellModel, 'loanwellId', Loanwell);
  }

  /**
   * Fetch all loanwells from database with pagination
   * @returns UserMedia[]
   * @param {PaginationOptions} paginationOptions
   * @param {{showTrashed: boolean, querty:string}} options
   */
  async fetchAll(options): Promise<PaginationData<Loanwell>> {
    const { paginationOptions, showTrashed = false, query } = options;

    return super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: query,
      order: [['createdAt', 'desc']],
    });
  }
  
}

export default LoanwellRepository;
