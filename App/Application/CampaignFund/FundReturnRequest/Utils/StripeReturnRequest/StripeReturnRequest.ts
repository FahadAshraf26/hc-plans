import HttpError from '@infrastructure/Errors/HttpException';
import { inject, injectable } from 'inversify';
import { IStripeReturnRequest } from '@application/CampaignFund/FundReturnRequest/Utils/StripeReturnRequest/IStripeReturnRequest';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';
import HybridTransaction from '@domain/Core/HybridTransactions/HybridTransaction';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';

@injectable()
export class StripeReturnRequest implements IStripeReturnRequest {
  constructor(@inject(IStripeServiceId) private stripeService: IStripeService) { }
  async execute(hybridTransaction: HybridTransaction) {
    if (hybridTransaction.status === ChargeStatus.PENDING) {
      await this.stripeService.cancelPayment(hybridTransaction.getTradeId());
    }
    if (hybridTransaction.status === ChargeStatus.SUCCESS) {
      const refundByStripe = await this.stripeService.refundInvestment(
        hybridTransaction.getTradeId(),
        Number(hybridTransaction.getAmount()) +
        Number(hybridTransaction.getApplicationFee())
      );
      if (!refundByStripe) throw new HttpError(400, `Error refunding Stripe investment`);
    }
    return true;
  }
}
