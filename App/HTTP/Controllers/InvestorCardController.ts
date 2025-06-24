import AddStripeCardDTO from '@application/InvestorBank/AddStripeCard/AddStripeCardDTO';
import {
  IAddStripeCardUsecase,
  IAddStripeCardUsecaseId,
} from '@application/InvestorBank/AddStripeCard/IAddStripeCardUsecase';
import GetLinkedCreditCardDTO from '@application/InvestorBank/linkCreditCard/GetLinkedCreditCardDTO';
import {
  ILinkCreditCardService,
  ILinkCreditCardServiceId,
} from '@application/InvestorBank/linkCreditCard/ILinkCreditCardService';
import LinkCreditCardDTO from '@application/InvestorBank/linkCreditCard/LinkCreditCardDTO';
import { inject, injectable } from 'inversify';

@injectable()
class InvestorCardController {
  constructor(
    @inject(ILinkCreditCardServiceId)
    private linkCreditCardService: ILinkCreditCardService,
    @inject(IAddStripeCardUsecaseId) private addStripeCardUsecase: IAddStripeCardUsecase,
  ) {}

  linkCreditCard = async (httpRequest) => {
    const { userId, accountId } = httpRequest.params;
    const input = new LinkCreditCardDTO(userId, accountId);
    const data = await this.linkCreditCardService.linkCreditCard(input);
    return {
      body: {
        status: 'success',
        data,
      },
    };
  };

  getLinkedCreditCard = async (httpRequest) => {
    const { userId, accountId } = httpRequest.params;
    const input = new GetLinkedCreditCardDTO(userId, accountId);
    await this.linkCreditCardService.getLinkedCreditCard(input);
    return {
      body: {
        status: 'success',
        message: 'Credit Card added successfully',
      },
    };
  };

  attachCreditCard = async (httpRequest) => {
    const { userId } = httpRequest.params;
    const { paymentMethodId, brand, lastFour, nameOnCard } = httpRequest.body;
    const input = new AddStripeCardDTO({ paymentMethodId, brand, lastFour, userId, nameOnCard });
    await this.addStripeCardUsecase.execute(input);
    return {
      body: {
        status: 'success',
        message: 'Credit Card added successfully',
      },
    };
  };
}

export default InvestorCardController;
