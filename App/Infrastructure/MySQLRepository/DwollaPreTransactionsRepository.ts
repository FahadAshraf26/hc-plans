import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import DwollaPreTransactions from '@domain/Core/DwollaPreTransactions/DwollaPreTransactions';
import Model from '@infrastructure/Model';
import { IDwollaPreTransactionsRepository } from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import { injectable } from 'inversify';
import { Op } from 'sequelize';

const { DwollaPreTransactionsModel, sequelize, Sequelize } = Model;

@injectable()
class DwollaPreTransactionsRepository extends BaseRepository
  implements IDwollaPreTransactionsRepository {
  constructor() {
    super(DwollaPreTransactionsModel, 'dwollaPreTransactionId', DwollaPreTransactions);
  }

  async fetchAllLatestPreTransactions() {
    const dwollaPreTransactionQuery = `SELECT 
                                              * 
                                        FROM 
                                              dwollaPreTransactions 
                                        WHERE 
                                              deletedAt is null and
                                              status != "Processed"
                                        ORDER BY createdAt ASC`;
    const totalCountQuery = `SELECT count(*) totalCount FROM dwollaPreTransactions WHERE deletedAt is null and status != "Processed"`;
    const totalAmountQuery = `SELECT sum(total) totalAmount FROM dwollaPreTransactions WHERE deletedAt is null and status != "Processed"`;
    const dwollaPreTransactions = await sequelize.query(dwollaPreTransactionQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalCount }] = await sequelize.query(totalCountQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const [{ totalAmount }] = await sequelize.query(totalAmountQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    return {
      dwollaPreTransactions,
      totalCount,
      totalAmount: totalAmount === null ? 0 : totalAmount,
    };
  }

  async fetchAllByUploadId(uploadId: string) {
    const dwollaPreTransactionQuery = `SELECT 
                                              * 
                                        FROM 
                                              dwollaPreTransactions 
                                        WHERE 
                                              deletedAt is null 
                                              and uploadId = '${uploadId}'
                                              and status != "Processed"
                                        ORDER BY createdAt ASC`;

    return sequelize.query(dwollaPreTransactionQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
  }

  async removeAllByUploadId(uploadId: string) {
    return DwollaPreTransactionsModel.destroy({
      where: {
        uploadId,
        status: {
          [Op.ne]: 'Processed',
        },
      },
      force: true,
    });
  }
}

export default DwollaPreTransactionsRepository;
