import { injectable } from 'inversify';
import CapitalRequest from '../../Domain/Core/CapitalRequest/CapitalRequest';
import PaginationData from '../../Domain/Utils/PaginationData';
import BaseRepository from './BaseRepository';
import { ICapitalRequestRepository } from '../../Domain/Core/CapitalRequest/ICapitalRequestRepository';
import models from '../Model';
const { CapitalRequestModel } = models;

@injectable()
class CapitalRequestRepository extends BaseRepository
  implements ICapitalRequestRepository {
  constructor() {
    super(CapitalRequestModel, 'capitalRequestId', CapitalRequest);
  }

  /**
   * Fetch all capitalRequests from database with pagination
   * @returns CapitalRequest[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({
    paginationOptions,
    showTrashed = false,
  }): Promise<PaginationData<CapitalRequest>> {
    return super.fetchAll({
      paginationOptions,
      showTrashed,
      order: [['createdAt', 'desc']],
    });
  }
}

export default CapitalRequestRepository;
