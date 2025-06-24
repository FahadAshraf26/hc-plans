import { IDwollaPreTransactionsRepositoryId,IDwollaPreTransactionsRepository } from '@domain/Core/DwollaPreTransactions/IDwollaPreTransactionsRepository';
import { IDwollaPostTransactionsRepository } from '@domain/Core/DwollaPostTransactions/IDwollaPostTransactionsRepository';
import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { inject, injectable } from 'inversify';
import Model from '@infrastructure/Model';
import DwollaPostTransactions from '@domain/Core/DwollaPostTransactions/DwollaPostTransactions';
import PaginationData from '@domain/Utils/PaginationData';
import DatabaseError from '../Errors/DatabaseError';
import Issuer from '@domain/Core/Issuer/Issuer';

const { DwollaPostTransactionsModel, IssuerModel, OwnerModel } = Model;

@injectable()
class DwollaPostTransactionsRepository extends BaseRepository
  implements IDwollaPostTransactionsRepository {
  constructor(@inject(IDwollaPreTransactionsRepositoryId) private dwollaPreTransaction:IDwollaPreTransactionsRepository) {
    super(DwollaPostTransactionsModel, 'dwollaPostTransactionId', DwollaPostTransactions);
  }

  async fetchPostTransafers(paginationOptions, showTrashed) {
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
      const response = await DwollaPostTransactionsModel.findAndCountAll({
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        include: includes,
        paranoid: !showTrashed,
        order: [['createdAt', 'DESC']],
      });

      const paginationData = new PaginationData(paginationOptions, response.count);
      for (const entityObj of response.rows) {
        const dwollaPostTransaction = DwollaPostTransactions.createFromObject(entityObj);
        if (entityObj.dwollaPreTransactionId) {
          dwollaPostTransaction.setDwollaPreTransactionId(entityObj.dwollaPreTransactionId);
          const preTransaction = await this.dwollaPreTransaction.fetchById(entityObj.dwollaPreTransactionId);
          if (preTransaction) {
            dwollaPostTransaction.setInvestorEmail(preTransaction.investorEmail);
            dwollaPostTransaction.setInvestorName(preTransaction.investorName);
          }
        }
        const issuer = Issuer.createFromObject(entityObj.issuer);
        issuer.setOwner(entityObj.issuer.owners);
        dwollaPostTransaction.setIssuers(issuer);
        paginationData.addItem(dwollaPostTransaction);
      }

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByTransferId(transferId) {
    const dwollaPostTransaction = await DwollaPostTransactionsModel.findOne({
      where: { dwollaTransferId: transferId },
    });
    if (!dwollaPostTransaction) {
      return null;
    }

    return DwollaPostTransactions.createFromObject(dwollaPostTransaction);
  }
}

export default DwollaPostTransactionsRepository;
