import AddStripeCardDTO from './AddStripeCardDTO';

export const IAddStripeCardUsecaseId = Symbol.for('IAddStripeCardUsecase');

export interface IAddStripeCardUsecase {
  execute(addStripeCardDTO: AddStripeCardDTO): Promise<any>;
}
