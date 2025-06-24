import FCDwollaTransactions from '@domain/Core/FCDwollaTransactions/FCDwollaTransactions';
import FCDwollaTransactionsModel from '@infrastructure/Model/FCDwollaTransactions';
import BaseRepository from './BaseRepository';
import { IFCDwollaTransactionsRepository } from '@domain/Core/FCDwollaTransactions/IFCDwollaTransactionsRepository';

export default class FCDwollaTransactionsRepository extends BaseRepository
  implements IFCDwollaTransactionsRepository {
  constructor() {
    super(FCDwollaTransactionsModel, 'fcDwollaTransactionsId', FCDwollaTransactions);
  }
}
