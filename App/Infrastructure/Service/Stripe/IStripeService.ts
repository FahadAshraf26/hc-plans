export const IStripeServiceId = Symbol.for('IStripeService');
export interface IStripeService {
  createCustomer(user): Promise<any>;
  attachCardWithCustomer(customerId: string, paymentMethodId: string): Promise<any>;
  externalFundMovement(
    amount,
    stripeCustomerId,
    description,
    campaignId,
    campaignName,
    stripePaymentCardId,
    campaignEscrowType,
    stripeFee
  ): Promise<any>;
  refundInvestment(paymentIntentId: string, investmentAmount: number): Promise<any>;
  cancelPayment(paymentIntentId: string): Promise<any>;
  createPaymentIntentforEpay(amount: number, description: string, stripeCustomerId: string, campaignId: string, campaignName: string,campaignEscrowType: string,stripeFee: number): Promise<any>;
  getTransactionStatus(paymentIntentId: string): Promise<any>;
}
