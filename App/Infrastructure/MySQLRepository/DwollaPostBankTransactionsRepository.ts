import { IDwollaPostBankTransactionsRepository } from '@domain/Core/DwollaPostBankTransactions/IDwollaPostBankTransactionsRepository';
import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { injectable } from 'inversify';
import Model from '@infrastructure/Model';
import DwollaPostBankTransactions from '@domain/Core/DwollaPostBankTransactions/DwollaPostBankTransactions';
import PaginationData from '@domain/Utils/PaginationData';
import DatabaseError from '../Errors/DatabaseError';
import Issuer from '@domain/Core/Issuer/Issuer';

const { DwollaPostBankTransactionsModel, IssuerModel, OwnerModel } = Model;

@injectable()
class DwollaPostBankTransactionsRepository extends BaseRepository
  implements IDwollaPostBankTransactionsRepository {
  constructor() {
    super(
      DwollaPostBankTransactionsModel,
      'dwollaPostBankTransactionId',
      DwollaPostBankTransactions,
    );
  }

  async fetchPostBankTransafers(paginationOptions, showTrashed) {
    const includes = [
      {
        model: IssuerModel,
        as: 'issuer',
        include: [
          {
            model: OwnerModel,
            as: 'owners',
          },
        ],
      },
    ];
    try {
      const response = await DwollaPostBankTransactionsModel.findAndCountAll({
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        include: includes,
        paranoid: !showTrashed,
        order: [['createdAt', 'DESC']],
      });

      const paginationData = new PaginationData(paginationOptions, response.count);
      response.rows.forEach((entityObj) => {
        const dwollaPostBankTransaction = DwollaPostBankTransactions.createFromObject(
          entityObj,
        );
        const issuer = Issuer.createFromObject(entityObj.issuer);
        issuer.setOwner(entityObj.issuer.owners);
        dwollaPostBankTransaction.setIssuers(issuer);
        paginationData.addItem(dwollaPostBankTransaction);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByTransferId(transferId) {
    const dwollaPostBankTransaction = await DwollaPostBankTransactionsModel.findOne({
      where: { dwollaTransferId: transferId },
    });
    if (!dwollaPostBankTransaction) {
      return null;
    }

    return DwollaPostBankTransactions.createFromObject(dwollaPostBankTransaction);
  }
}

export default DwollaPostBankTransactionsRepository;
