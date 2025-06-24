import { IInvestorDao } from '@domain/Core/Investor/IInvestorDao';
import models from '../Model';
import Investor from '@domain/Core/Investor/Investor';
import BaseRepository from './BaseRepository';
const { InvestorModel, InvestorBankModel, UserModel } = models;

class InvestorDAO extends BaseRepository implements IInvestorDao {
  constructor() {
    super(InvestorModel, 'investorId', Investor);
  }

  /**
   * fetchById(investorId) fetch investor By Id
   * @param {string} userId
   * @param showTrashed
   * @returns Investor
   */
  async fetchByUserId(userId, showTrashed = false) {
    return super.fetchOneByCustomCritera({
      whereConditions: { userId, deletedAt: null },
      showTrashed,
    });
  }

  async fetchByHash(hash, showTrashed = false) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        investReadyUserHash: hash,
      },
      showTrashed,
    });
  }

  async fetchByDwollaId(dwollaCustomerId, showTrashed = false) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        dwollaCustomerId,
      },
      showTrashed,
    });
  }

  async fetchByNCAccountId(ncAccountId, showTrashed = false) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        ncAccountId,
      },
      showTrashed,
    });
  }

  async fetchByDwollaCustomerId(dwollaCustomerId) {
    return await InvestorModel.findOne({
      where: {
        dwollaCustomerId,
      },
      include: [
        {
          model: InvestorBankModel,
          as: 'investorBank',
        },
        {
          model: UserModel,
          as: 'user',
        },
      ],
    });
  }
}

export default InvestorDAO;
