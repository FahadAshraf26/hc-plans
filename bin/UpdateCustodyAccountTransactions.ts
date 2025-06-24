import dotenv from 'dotenv';
dotenv.config();
import container from '@infrastructure/DIContainer/container';
import DwollaService from '@infrastructure/Service/DwollaService';
import models from '@infrastructure/Model';
import DwollaCustodyTransactionsRepository from '@infrastructure/MySQLRepository/DwollaCustodyTransactionsRepository';
const { Sequelize, sequelize } = models;

const dwollaCustodyTransactions = container.get<DwollaCustodyTransactionsRepository>(
  DwollaCustodyTransactionsRepository,
);
const dwollaService = container.get<DwollaService>(DwollaService);

export const UpdateCustodyAccountNotCompletedTransactions = async () => {
  const dwollaPendingNotCompletedTransfers = await dwollaCustodyTransactions.fetchPendingNotCompletedTransfers();
  await Promise.all(
    dwollaPendingNotCompletedTransfers.map(async (item) => {
      const dwollaTransaction = await dwollaService.retrieveTransfer(
        item.dwollaTransferId,
      );

      const updateCustodyAccountTransactionQuery = `update dwollaCustodyTransactions set notCompletedStatus = '${dwollaTransaction.status}' where dwollaTransferId = '${item.dwollaTransferId}'`;
      return sequelize.query(updateCustodyAccountTransactionQuery, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    }),
  );
};

export const UpdateCustodyAccountCompletedTransactions = async () => {
  const dwollaPendingCompletedTransfers = await dwollaCustodyTransactions.fetchPendingCompletedTransfers();
  await Promise.all(
    dwollaPendingCompletedTransfers.map(async (item) => {
      const dwollaTransaction = await dwollaService.retrieveTransfer(
        item.dwollaTransferId,
      );
      const updateCustodyAccountTransactionQuery = `update dwollaCustodyTransactions set completedStatus = '${dwollaTransaction.status}' where dwollaTransferId = '${item.dwollaTransferId}'`;
      return sequelize.query(updateCustodyAccountTransactionQuery, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    }),
  );
};
