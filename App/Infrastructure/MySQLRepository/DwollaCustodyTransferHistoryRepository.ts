import DwollaCustodyTransferHistory from '@domain/Core/DwollaCustodyTransferHistory/DwollaCustodyTransferHistory';
import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { injectable } from 'inversify';
import Model from '@infrastructure/Model';
import { IDwollaCustodyTransferHistoryRepository } from '@domain/Core/DwollaCustodyTransferHistory/IDwollaCustodyTransferHistoryRepository';
import PaginationData from '@domain/Utils/PaginationData';
import DatabaseError from '../Errors/DatabaseError';
const { DwollaCustodyTransferHistoryModel, IssuerModel } = Model;

@injectable()
class DwollaCustodyTransferHistoryRepository extends BaseRepository
  implements IDwollaCustodyTransferHistoryRepository {
  constructor() {
    super(
      DwollaCustodyTransferHistoryModel,
      'dwollaCustodyTransferHistoryId',
      DwollaCustodyTransferHistory,
    );
  }

  async fetchAll({ paginationOptions, showTrashed = false }) {
    try {
      const {
        rows: all,
        count,
      } = await DwollaCustodyTransferHistoryModel.findAndCountAll({
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        paranoid: !showTrashed,
        include: [
          {
            model: IssuerModel,
            as: 'issuer',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      const paginationData = new PaginationData(paginationOptions, count);

      all.forEach((row) => {
        const dwollaCustodyTransferHistory = DwollaCustodyTransferHistory.createFromObject(
          row,
        );
        dwollaCustodyTransferHistory.setIssuer(row.issuer);
        paginationData.addItem(dwollaCustodyTransferHistory);
      });

      return paginationData;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default DwollaCustodyTransferHistoryRepository;
