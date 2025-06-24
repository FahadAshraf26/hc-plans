import { IDwollaCustodyTransactionsRepository } from '@domain/Core/DwollaCustodyTransactions/IDwollaCustodyTransactionsRepository';
import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { injectable } from 'inversify';
import Model from '@infrastructure/Model';
import DwollaCustodyTransactions from '@domain/Core/DwollaCustodyTransactions/DwollaCustodyTransactions';
import PaginationData from '@domain/Utils/PaginationData';
import DatabaseError from '../Errors/DatabaseError';
import Issuer from '@domain/Core/Issuer/Issuer';

const {
  DwollaCustodyTransactionsModel,
  IssuerModel,
  OwnerModel,
  Sequelize,
  sequelize,
} = Model;

const { Op } = Sequelize;

@injectable()
class DwollaCustodyTransactionsRepository extends BaseRepository
  implements IDwollaCustodyTransactionsRepository {
  constructor() {
    super(
      DwollaCustodyTransactionsModel,
      'dwollaCustodyTransactionId',
      DwollaCustodyTransactions,
    );
  }

  async fetchCustodyTransafers(paginationOptions, showTrashed) {
    try {
      const totalCount = await DwollaCustodyTransactionsModel.count({
        include: [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: ['issuerName', 'issuerId'],
          },
        ],
        where: {
          isCompleted: 0,
        },
        distinct: true,
        col: 'dwollaCustodyTransactionId',
      });

      // For the data query
      const rows = await DwollaCustodyTransactionsModel.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'amount'],
          'source',
          'destination',
          'businessOwnerName',
          'businessOwnerEmail',
          'notCompletedStatus',
          'dwollaCustodyTransactionId',
          [
            sequelize.literal(`CASE 
              WHEN notCompletedStatus = 'pending' THEN 'pending'
              ELSE notCompletedStatus
              END`),
            'status',
          ],
        ],
        include: [
          {
            model: IssuerModel,
            as: 'issuer',
            attributes: ['issuerName', 'issuerId'],
          },
        ],
        where: {
          isCompleted: 0,
        },
        group: [
          'issuer.issuerName',
          'issuer.issuerId',
          'source',
          'destination',
          'businessOwnerName',
          'businessOwnerEmail',
          'notCompletedStatus',
          'dwollaCustodyTransactionId',
        ],
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        subQuery: false,
      });

      const transformedRows = rows.map((row) => {
        const plainRow = row.get({ plain: true });
        return {
          issuerName: plainRow.issuer.issuerName,
          issuerId: plainRow.issuer.issuerId,
          amount: plainRow.amount,
          source: plainRow.source,
          destination: plainRow.destination,
          businessOwnerName: plainRow.businessOwnerName,
          businessOwnerEmail: plainRow.businessOwnerEmail,
          status: plainRow.status,
          notCompletedStatus: plainRow.notCompletedStatus,
          dwollaCustodyTransactionId: plainRow.dwollaCustodyTransactionId,
        };
      });

      const paginationData = new PaginationData(paginationOptions, totalCount);

      transformedRows.forEach((row) => {
        paginationData.addItem(row);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
  async fetchCompletedCustodyTransafers(paginationOptions, showTrashed) {
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
      const response = await DwollaCustodyTransactionsModel.findAndCountAll({
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        include: includes,
        paranoid: !showTrashed,
        order: [['createdAt', 'DESC']],
        where: { isCompleted: { [Op.eq]: true } },
      });

      const paginationData = new PaginationData(paginationOptions, response.count);
      response.rows.forEach((entityObj) => {
        const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
          entityObj,
        );
        const issuer = Issuer.createFromObject(entityObj.issuer);
        issuer.setOwner(entityObj.issuer.owners);
        dwollaCustodyTransaction.setIssuers(issuer);
        paginationData.addItem(dwollaCustodyTransaction);
      });

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchPendingNotCompletedTransfers() {
    try {
      const response = await DwollaCustodyTransactionsModel.findAll({
        paranoid: false,
        order: [['createdAt', 'DESC']],
        where: {
          isCompleted: { [Op.eq]: false },
          notCompletedStatus: { [Op.eq]: 'pending' },
        },
      });

      return response.map((entityObj) => {
        const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
          entityObj,
        );
        return dwollaCustodyTransaction;
      });
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchPendingCompletedTransfers() {
    try {
      const response = await DwollaCustodyTransactionsModel.findAll({
        paranoid: false,
        order: [['createdAt', 'DESC']],
        where: {
          isCompleted: { [Op.eq]: true },
          completedStatus: { [Op.eq]: 'pending' },
        },
      });

      return response.map((entityObj) => {
        const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
          entityObj,
        );
        return dwollaCustodyTransaction;
      });
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByTransferId(transferId) {
    const dwollaCustodyTransaction = await DwollaCustodyTransactionsModel.findOne({
      where: { dwollaTransferId: transferId },
    });
    if (!dwollaCustodyTransaction) {
      return null;
    }

    return DwollaCustodyTransactions.createFromObject(dwollaCustodyTransaction);
  }

  async fetchAllNotCompletedRecords() {
    const dwollaCustodyTransactionQuery = `SELECT 
                                                  * 
                                            FROM 
                                                  dwollaCustodyTransactions 
                                            WHERE 
                                                  deletedAt is null and
                                                  isCompleted = 0
                                            ORDER BY createdAt ASC`;

    const dwollaCustodyTransactions = await sequelize.query(
      dwollaCustodyTransactionQuery,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    return dwollaCustodyTransactions;
  }

  async fetchById(dwollaCustodyTransactionId, isCompleted) {
    const dwollaCustodyTransactionObj = await DwollaCustodyTransactionsModel.findOne({
      where: {
        dwollaCustodyTransactionId,
        isCompleted,
      },
    });
    const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
      dwollaCustodyTransactionObj,
    );
    dwollaCustodyTransaction.setIssuerId(dwollaCustodyTransactionObj.issuerId);
    return dwollaCustodyTransaction;
  }

  async fetchByIssuerId(issuerId, isCompleted) {
    const dwollaCustodyTransactions = [];

    const dwollaCustodyTransactionObjects = await DwollaCustodyTransactionsModel.findAll({
      where: {
        issuerId,
        isCompleted,
      },
    });
    dwollaCustodyTransactionObjects.forEach((dwollaCustodyTransactionObj) => {
      const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
        dwollaCustodyTransactionObj,
      );
      dwollaCustodyTransaction.setIssuerId(dwollaCustodyTransactionObj.issuerId);
      dwollaCustodyTransactions.push(dwollaCustodyTransaction);
    });

    return dwollaCustodyTransactions;
  }

  async fetchDistinctIssuerIds() {
    const sql = `SELECT DISTINCT
                      (issuerId) AS issuerId
                  FROM
                      dwollaCustodyTransactions;`;

    const result = await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return result;
  }

  async updateByCustodyTransferId(
    dwollaCustodyTransactionId: string,
    transferId: string,
  ) {
    await DwollaCustodyTransactionsModel.update(
      { isCompleted: true, dwollaTransferId: transferId, status: 'proccessed' },
      {
        where: {
          dwollaCustodyTransactionId,
          isCompleted: false,
        },
      },
    );
  }

  async fetchTotalAmountofSuccessfulCustodyTransactionsByIssuerId(issuerId) {
    const totalAmountResult = await DwollaCustodyTransactionsModel.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
      where: {
        deletedAt: null,
        isCompleted: false,
        notCompletedStatus: 'processed',
        issuerId,
      },
      raw: true,
    });

    return totalAmountResult && totalAmountResult.totalAmount
      ? totalAmountResult.totalAmount
      : 0;
  }

  async fetchSuccessfulByIssuerId(issuerId: string) {
    const dwollaCustodyTransactions = [];

    const dwollaCustodyTransactionObjects = await DwollaCustodyTransactionsModel.findAll({
      where: {
        issuerId,
        isCompleted: false,
        notCompletedStatus: 'processed',
      },
    });

    dwollaCustodyTransactionObjects.forEach((dwollaCustodyTransactionObj) => {
      const dwollaCustodyTransaction = DwollaCustodyTransactions.createFromObject(
        dwollaCustodyTransactionObj,
      );
      dwollaCustodyTransaction.setIssuerId(dwollaCustodyTransactionObj.issuerId);
      dwollaCustodyTransactions.push(dwollaCustodyTransaction);
    });

    return dwollaCustodyTransactions;
  }
}

export default DwollaCustodyTransactionsRepository;
