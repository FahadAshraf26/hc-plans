import { inject, injectable } from 'inversify';
import AddStripeCardDTO from './AddStripeCardDTO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import { IInvestorPaymentOptionsRepositoryId } from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import InvestorPaymentOptionsRepository from '@infrastructure/MySQLRepository/InvestorPaymentOptions/InvestorPaymentOptionsRepository';
import HttpError from '@infrastructure/Errors/HttpException';
import CardType from '@domain/InvestorPaymentOptions/CardType';
import InvestorCard from '@domain/InvestorPaymentOptions/InvestorCard';
import PaymentOptionType from '@domain/InvestorPaymentOptions/PaymentOptionType';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';
import {
  IStripeService,
  IStripeServiceId,
} from '@infrastructure/Service/Stripe/IStripeService';

@injectable()
class AddStripeCardUsecase {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: InvestorPaymentOptionsRepository,
    @inject(IStripeServiceId) private stripeService: IStripeService,
  ) {}

  async execute(addStripeCardDTO: AddStripeCardDTO) {
    const { userId, brand, lastFour, paymentMethodId, nameOnCard } = addStripeCardDTO;
    const user = await this.userRepository.fetchById(userId, false);
    if (!user) {
      throw new HttpError(400, 'No record exists against provided input');
    }
    const { investor } = user;
    const result = await this.stripeService.attachCardWithCustomer(
      user.stripeCustomerId,
      paymentMethodId,
    );
    if (result) {
      const investorCard = await this.investorPaymentOptionsRepository.fetchInvestorCard(
        investor.investorId,
        true,
      );
      if (investorCard) {
        await this.investorPaymentOptionsRepository.remove(investorCard);
      }
      const cardType = CardType.createFromValue(brand);
      const cardInput = {
        creditCardName: nameOnCard,
        cardType: cardType.getValue(),
        lastFour: lastFour,
        isStripeCard: true,
      };
      const card = InvestorCard.create(cardInput);
      const input = {
        type: PaymentOptionType.Card(),
        investorId: investor.investorId,
        card: card,
      };
      const investorPaymentOptions = InvestorPaymentOptions.create(input);

      await this.investorPaymentOptionsRepository.add(investorPaymentOptions);
      user.stripePaymentMethodId = paymentMethodId;
      await this.userRepository.update(user);
      return true;
    } else {
      throw new HttpError(400, 'unable to attach credit card!');
    }
  }
}

export default AddStripeCardUsecase;
