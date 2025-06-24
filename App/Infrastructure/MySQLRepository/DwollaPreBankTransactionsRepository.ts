import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { IDwollaPreBankTransactionsRepository } from '@domain/Core/DwollaPreBankTransactions/IDwollaPreBankTransactionsRepository';
import Model from '@infrastructure/Model';
import DwollaPreBankTransactions from '@domain/Core/DwollaPreBankTransactions/DwollaPreBankTransactions';
import { injectable } from 'inversify';

const { DwollaPreBankTransactionsModel, sequelize, Sequelize } = Model;

@injectable()
class DwollaPreBankTransactionsRepository extends BaseRepository
  implements IDwollaPreBankTransactionsRepository {
  constructor() {
    super(
      DwollaPreBankTransactionsModel,
      'dwollaPreBankTransactionId',
      DwollaPreBankTransactions,
    );
  }

  async fetchAllLatestPreBankTransactionsForWallet() {
    const dwollaPreBankTransactionQuery = `SELECT 
                                                  * 
                                            FROM 
                                                  dwollaPreBankTransactions 
                                            WHERE 
                                                  deletedAt is null and
                                                  status != "Processed" and
                                                  (destination = 'wallet' or destination = 'Wallet')
                                            ORDER BY createdAt ASC`;

    const dwollaPreBankTransactions = await sequelize.query(
      dwollaPreBankTransactionQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    return { dwollaPreBankTransactions };
  }

  async fetchAllLatestPreBankTransactionsForCustody() {
    const dwollaPreBankTransactionQuery = `SELECT 
                                                  * 
                                            FROM 
                                                  dwollaPreBankTransactions 
                                            WHERE 
                                                  deletedAt is null and
                                                  status != "Processed" and
                                                  (destination = 'custody' or destination = 'Custody')
                                            ORDER BY createdAt ASC`;

    const dwollaPreBankTransactions = await sequelize.query(
      dwollaPreBankTransactionQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    return { dwollaPreBankTransactions };
  }

  async fetchAllByUploadId(uploadId: string) {
    const dwollaPreBankTransactionQuery = `SELECT 
                                                  * 
                                            FROM 
                                                  dwollaPreBankTransactions 
                                            WHERE 
                                                  deletedAt is null 
                                                  and uploadId = '${uploadId}' and
                                              status != "Processed"
                                            ORDER BY createdAt ASC`;

    return sequelize.query(dwollaPreBankTransactionQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
  }

  async removeAllByUploadId(uploadId: string) {
    return DwollaPreBankTransactionsModel.destroy({
      where: {
        uploadId,
      },
      force: true,
    });
  }

  async removeAllByDwollaPreBankTransactionId(dwollaPreBankTransactionId: string) {
    return DwollaPreBankTransactionsModel.destroy({
      where: {
        dwollaPreBankTransactionId,
      },
      force: true,
    });
  }
}

export default DwollaPreBankTransactionsRepository;
