import {
  IHandleUSAEpayWebhookUseCase,
  IHandleUSAEpayWebhookUseCaseId,
} from '@application/Webhooks/USAEpay/handleUSAEpayWebhook/IHandleUSAEpayWebhookUseCase';
import { inject, injectable } from 'inversify';
import USAEPayWebhookType from '@domain/USAEpayWebhooks/USAEpayWebhookType';
import logger from '@infrastructure/Logger/logger';

@injectable()
class USAEpayWebhookController {
  constructor(
    @inject(IHandleUSAEpayWebhookUseCaseId)
    private handleUSAEpayWebhookUseCase: IHandleUSAEpayWebhookUseCase,
  ) {}

  USAEpayWebhook = (webhookType) => async (req, res) => {
    const { body: payload } = req;
    logger.info(`Payload from USAePay`);
    logger.info(payload);
    res.status(200).send({
      status: 'success',
    });

    const dto = {
      payload,
      webhookType,
    };
    await this.handleUSAEpayWebhookUseCase.execute(dto);
  };

  transactionSaleSuccess = this.USAEpayWebhook(
    USAEPayWebhookType.TransactionSaleSuccess(),
  );
  trasactionSaleFailure = this.USAEpayWebhook(
    USAEPayWebhookType.TransactionSaleFailure(),
  );
  trasactionSaleVoid = this.USAEpayWebhook(USAEPayWebhookType.TransactionSaleVoid());
  achSettled = this.USAEpayWebhook(USAEPayWebhookType.AchSettled());
  achFailed = this.USAEpayWebhook(USAEPayWebhookType.AchFailed());
  achVoided = this.USAEpayWebhook(USAEPayWebhookType.AchVoided());
}

export default USAEpayWebhookController;
