import { inject, injectable } from 'inversify';
import { IUSAEpayEventHandlerFactory } from './IUSAEpayEventHandlerFactory';
import USAEPayWebhookType from '@domain/USAEpayWebhooks/USAEpayWebhookType';
import {
  ITransactionSaleFailure,
  ITransactionSaleFailureId,
} from './TransactionSaleFailure/ITransactionSaleFailue';
import {
  ITransactionSaleSuccess,
  ITransactionSaleSuccessId,
} from './TransactionSaleSuccess/ITransactionSaleSuccess';

@injectable()
class USAEpayEventHandlerFactory implements IUSAEpayEventHandlerFactory {
  constructor(
    @inject(ITransactionSaleFailureId)
    private transactionSaleFailure: ITransactionSaleFailure,
    @inject(ITransactionSaleSuccessId)
    private transactionSaleSuccess: ITransactionSaleSuccess,
  ) {}

  createHandlerFromTopic(webhookType) {
    switch (webhookType) {
      case USAEPayWebhookType.TransactionSaleSuccess().value():
        return this.transactionSaleSuccess;
      case USAEPayWebhookType.TransactionSaleFailure().value():
        return this.transactionSaleFailure;
    }
  }
}

export default USAEpayEventHandlerFactory;
