import { injectable, inject } from 'inversify';
import { IStripeWebhook } from './IStripeWebhook';
import {
  IPaymentIntentSucceeded,
  IPaymentIntentSucceededId,
} from './WebhookHandlers/PaymentIntentSucceeded/IPaymentIntentSucceeded';
import {
  IPaymentIntentFailure,
  IPaymentIntentFailureId,
} from './WebhookHandlers/PaymentIntentFailure/IPaymentIntentFailure';
import {
  IPaymentProcessing,
  IPaymentProcessingId,
} from './WebhookHandlers/PaymentIntentProcessing/IPaymentProcessing';
import {
  IPaymentIntentCancelled,
  IPaymentIntentCancelledId,
} from './WebhookHandlers/PaymentIntentCancelled/IPaymentIntentCancelled';
import {
  IPaymentIntentCreated,
  IPaymentIntentCreatedId,
} from './WebhookHandlers/PaymentIntentCreated/IPaymentIntentCreated';
import {
  ICustomerCreated,
  ICustomerCreatedId,
} from './WebhookHandlers/CustomerCreated/ICustomerCreated';
import { StripeWebhooksTyps } from '@infrastructure/Utils/StripeWebhooksTypes';
import { IPayoutPaid, IPayoutPaidId } from './WebhookHandlers/PayoutPaid/IPayoutPaid';
import {
  IPayoutFailed,
  IPayoutFailedId,
} from './WebhookHandlers/PayoutFailed/IPayoutFailed';
import {
  IChargeSuccess,
  IChargeSuccessId,
} from './WebhookHandlers/ChargeSuccess/IChargeSuccess';
import {
  IChargeFailed,
  IChargeFailedId,
} from './WebhookHandlers/ChargeFailed/IChargeFailed';
import { IChargeRefund, IChargeRefundId } from './WebhookHandlers/ChargeRefund/IChargeRefund';
import logger from '@infrastructure/Logger/logger';
import { IChargeRefundFailed, IChargeRefundFailedId } from './WebhookHandlers/ChargeRefundFailed/IChargeRefundFailed';

@injectable()
class StripeWebhook implements IStripeWebhook {
  constructor(
    @inject(IPaymentIntentSucceededId)
    private paymentIntentSucceeded: IPaymentIntentSucceeded,
    @inject(IPaymentIntentFailureId) private paymentIntentFailure: IPaymentIntentFailure,
    @inject(IPaymentProcessingId) private paymentProcessing: IPaymentProcessing,
    @inject(IPaymentIntentCancelledId)
    private paymentIntentCancelled: IPaymentIntentCancelled,
    @inject(IPaymentIntentCreatedId) private paymentIntentCreated: IPaymentIntentCreated,
    @inject(ICustomerCreatedId) private customerCreated: ICustomerCreated,
    @inject(IPayoutPaidId) private payoutPaid: IPayoutPaid,
    @inject(IPayoutFailedId) private payoutFailed: IPayoutFailed,
    @inject(IChargeSuccessId) private chargeSucess: IChargeSuccess,
    @inject(IChargeFailedId) private chargeFailed: IChargeFailed,
    @inject(IChargeRefundId) private chargeRefund: IChargeRefund,
    @inject(IChargeRefundFailedId) private chargeRefundFailed: IChargeRefundFailed,
  ) {}

  async execute(event) {
    switch (event.type) {
      case StripeWebhooksTyps.CUSTOMER_CREATED:
        await this.customerCreated.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYMENT_INTENT_SUCCEEDED:
        await this.paymentIntentSucceeded.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYMENT_INTENT_FAILED:
        await this.paymentIntentFailure.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYMENT_INTENT_PROCESSING:
        await this.paymentProcessing.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYMENT_INTENT_CANCELED:
        await this.paymentIntentCancelled.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYOUT_PAID:
        await this.payoutPaid.execute(event.data.object);
        break;
      case StripeWebhooksTyps.PAYOUT_FAILED:
        await this.payoutFailed.execute(event.data.object);
        break;
      case StripeWebhooksTyps.CHARGE_SUCCESS:
        await this.chargeSucess.execute(event.data.object);
        break;
      case StripeWebhooksTyps.CHARGE_FAILED:
        await this.chargeFailed.execute(event.data.object);
        break;
      case StripeWebhooksTyps.CHARGE_REFUNDED:
        await this.chargeRefund.execute(event.data.object);
        break;
      case StripeWebhooksTyps.REFUND_FAILED:
        await this.chargeRefundFailed.execute(event.data.object);
        break;
      default:
        logger.debug(event.type);
    }
  }
}

export default StripeWebhook;
