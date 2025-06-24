import dotenv from 'dotenv';
dotenv.config();
import container from '@infrastructure/DIContainer/container';
import HybridTransactionRepository from '@infrastructure/MySQLRepository/HybridTransactionRepository';
import DwollaService from '@infrastructure/Service/DwollaService';
import models from '@infrastructure/Model';
const { Sequelize, sequelize } = models;

const hybridTransactionRepository = container.get<HybridTransactionRepository>(
  HybridTransactionRepository,
);
const dwollaService = container.get<DwollaService>(DwollaService);

export const UpdateDwollaInvestmentTransaction = async () => {
  const hybridTransactions = await hybridTransactionRepository.fetchAllWalletTransactions();
  await Promise.all(
    hybridTransactions.map(async (item) => {
      const dwollaTransaction = await dwollaService.retrieveTransfer(
        item.dwollaTransactionId,
      );
      const relatedTransactionId = dwollaTransaction['_links']['funded-transfer'].href
        .split('/')
        .pop();
      const relatedTransaction = await dwollaService.retrieveTransfer(
        relatedTransactionId,
      );
      const updateHybridTransactionQuery = `update hybridTransactions set individualACHId = '${relatedTransaction.individualAchId}' where hybridTransactionId = '${item.hybridTransactionId}'`;
      return sequelize.query(updateHybridTransactionQuery, {
        type: Sequelize.QueryTypes.UPDATE,
      });
    }),
  );
};
