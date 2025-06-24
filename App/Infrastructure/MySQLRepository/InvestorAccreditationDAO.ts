import models from '../Model';
import InvestorAccreditation from '../../Domain/Core/InvestorAccreditation/InvestorAccreditation';
import { InvestorAccreditationResult } from '@domain/Core/ValueObjects/InvestorAccreditationResult';
import DatabaseError from '../Errors/DatabaseError';
import { IInvestorAccreditationDAO } from '@domain/Core/InvestorAccreditation/IInvestorAccreditationDAO';
import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
const { InvestorAccreditationModel } = models;

@injectable()
class InvestorAccreditationDAO extends BaseRepository
  implements IInvestorAccreditationDAO {
  constructor() {
    super(InvestorAccreditationModel, 'investorAccreditationId', InvestorAccreditation);
  }

  /**
   * Fetch InvestorAccreditation BY userId
   * @returns InvestorAccreditation
   * @param investorId
   * @param wherePendingResult
   * @param showTrashed
   */
  async fetchByInvestorId(
    investorId: string,
    wherePendingResult: boolean = true,
    showTrashed: boolean = false,
  ) {
    const whereConditions = { investorId };
    if (wherePendingResult) {
      whereConditions['result'] = InvestorAccreditationResult.PENDING;
    }

    return await super.fetchOneByCustomCritera({
      whereConditions,
      showTrashed,
      order: [['createdAt', 'desc']],
    });
  }

  /**
   *
   * @param {InvestorAccreditation} investorAccreditation
   */
  async upsert(investorAccreditation: InvestorAccreditation) {
    try {
      const investorAccreditationObj = await super.fetchById(
        investorAccreditation.getInvestorAccreditationId(),
      );

      if (investorAccreditationObj) {
        return await super.update(investorAccreditation);
      }

      return await super.add(InvestorAccreditation);
    } catch (error) {
      throw Error(error);
    }
  }

  async update(investorAccreditation: InvestorAccreditation) {
    try {
      await InvestorAccreditationModel.update(investorAccreditation, {
        where: {
          investorAccreditationId: investorAccreditation.getInvestorAccreditationId(),
        },
      });
      return true;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * Fetch InvestorAccreditation BY investorId
   * @param {string} investorId
   * @returns InvestorAccreditation[]
   */
  async fetchAllByInvestorId(investorId: string, paginationOptions, options) {
    const { wherePendingResult, showTrashed } = options;

    const whereConditions = { investorId };
    if (wherePendingResult) {
      whereConditions['result'] = InvestorAccreditationResult.PENDING;
    }

    return await super.fetchAll({
      whereConditions,
      paginationOptions,
      showTrashed,
    });
  }
}

export default InvestorAccreditationDAO;
