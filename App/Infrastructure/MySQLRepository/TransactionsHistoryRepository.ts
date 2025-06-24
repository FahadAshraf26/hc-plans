import { ITransactionsHistoryRepository } from '@domain/Core/TransactionsHistory/ITransactionsHistoryRepository';
import BaseRepository from './BaseRepository';
import Model from '../Model';
import TransactionsHistory from '@domain/Core/TransactionsHistory/TransactionsHistory';
import { injectable } from 'inversify';

const { TransactionsHistoryModel } = Model;

@injectable()
class TransactionsHistoryRepository extends BaseRepository
  implements ITransactionsHistoryRepository {
  constructor() {
    super(TransactionsHistoryModel, 'transactionsHistoryId', TransactionsHistory);
  }

  async getAllInvestorTransafers(userId: string) {
    const transactionsHistory = await TransactionsHistoryModel.findAll({
      where: { userId },
      order:[["createdAt","DESC"]]
    });

    return transactionsHistory.map((transactionHistory) => {
      return TransactionsHistory.createFromObject(transactionHistory);
    });
  }
}

export default TransactionsHistoryRepository;
