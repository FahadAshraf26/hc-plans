import { injectable } from 'inversify';
import DwollaToBankTransactions from '@domain/Core/DwollaToBankTransactions/DwollaToBankTransactions';
import { IDwollaToBankTransactionsRepository } from '@domain/Core/DwollaToBankTransactions/IDwollaToBankTransactionsRepository';
import Model from '@infrastructure/Model';
import DatabaseError from '../Errors/DatabaseError';
import PaginationData from '@domain/Utils/PaginationData';

const { DwollaToBankTransactionsModel, sequelize, Sequelize } = Model;

@injectable()
class DwollaToBankTransactionsRepository implements IDwollaToBankTransactionsRepository {
  constructor() {}

  async createTransafer(dwollaToBankTransactions) {
    try {
      await DwollaToBankTransactionsModel.create(dwollaToBankTransactions);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async getByTransactionId(transactionId: string) {
    const dwollaToBankTransaction = await DwollaToBankTransactionsModel.findOne({
      where: { dwollaTransactionId: transactionId, deletedAt: null },
    });

    if (!dwollaToBankTransaction) {
      return null;
    }

    return DwollaToBankTransactions.createFromObject(dwollaToBankTransaction);
  }

  async updateTransfer(dwollaToBankTransactions) {
    return DwollaToBankTransactionsModel.update(dwollaToBankTransactions, {
      where: {
        dwollaTransactionId: dwollaToBankTransactions.dwollaTransactionId,
      },
    });
  }

  async fetchAllTransferRecords(options) {
    const { paginationOptions, query } = options;
    const dwollaToBankTransactionsCountQuery = `
                                            SELECT 
                                                count(*) as totalItems 
                                            FROM 
                                                dwollaToBankTransactions dt join users u on dt.userId=u.userId 
                                            WHERE 
                                                dt.deletedAt is null AND
                                                dt.transferStatus like '%${query}' OR
                                                u.firstName like '%${query}' OR
                                                u.lastName like '%${query}' OR
                                                u.email like '%${query}'
                                            `;
    const dwollaToBankTransactionQuery = `
                                        SELECT
                                            dt.*,
                                            u.firstName,
                                            u.lastName,
                                            u.email 
                                        FROM 
                                            dwollaToBankTransactions dt 
                                        JOIN 
                                            users u on dt.userId=u.userId 
                                        WHERE 
                                            dt.deletedAt is null AND
                                            dt.transferStatus like '%${query}' OR
                                            u.firstName like '%${query}' OR
                                            u.lastName like '%${query}' OR
                                            u.email like '%${query}'
                                        ORDER BY dt.createdAt ASC
                                        LIMIT ${paginationOptions.limit()}
                                        OFFSET ${paginationOptions.offset()}
                                        `;

    const dwollaToBankTransactions = await sequelize.query(dwollaToBankTransactionQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const dwollaToBankTransactionsCount = await sequelize.query(
      dwollaToBankTransactionsCountQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    return { dwollaToBankTransactions, dwollaToBankTransactionsCount };
  }

  async fetchAllUserTransferRecords(options) {
    const { paginationOptions, userId } = options;
    const { count, rows: all } = await DwollaToBankTransactionsModel.findAndCountAll({
      where: {
        userId,
      },
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
    });
    const paginationData = new PaginationData(paginationOptions, count);
    all.forEach((obj) => {
      const transaction = DwollaToBankTransactions.createFromObject(obj);
      paginationData.addItem(transaction);
    });

    return paginationData;
  }

  async fetchOneByCustomCritera(options = {}) {
    try {
      const { includes = [], whereConditions = {} }: any = options;

      const entityRecord = await DwollaToBankTransactionsModel.findOne({
        where: whereConditions,
        include: includes,
      });

      if (!entityRecord) {
        return false;
      }

      return DwollaToBankTransactions.createFromObject(entityRecord);
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}

export default DwollaToBankTransactionsRepository;
