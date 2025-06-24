import { northCapitalService } from '@infrastructure/Service/PaymentProcessor';
import { inject, injectable } from 'inversify';
import LinkCreditCardDTO from './LinkCreditCardDTO';
import GetLinkedCreditCardDTO from './GetLinkedCreditCardDTO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import {
  IInvestorPaymentOptionsRepository,
  IInvestorPaymentOptionsRepositoryId,
} from '@domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';
import InvestorCard from '@domain/InvestorPaymentOptions/InvestorCard';
import { ILinkCreditCardService } from './ILinkCreditCardService';
import HttpError from '@infrastructure/Errors/HttpException';
import CardType from '@domain/InvestorPaymentOptions/CardType';
import PaymentOptionType from '@domain/InvestorPaymentOptions/PaymentOptionType';

@injectable()
class LinkCreditCardService implements ILinkCreditCardService {
  constructor(
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IInvestorPaymentOptionsRepositoryId)
    private investorPaymentOptionsRepository: IInvestorPaymentOptionsRepository,
  ) {}

  async linkCreditCard(linkCreditCardDTO: LinkCreditCardDTO) {
    const accountId = linkCreditCardDTO.getAccountId();
    const userId = linkCreditCardDTO.getUserId();
    const user = await this.userRepository.fetchById(userId, false);
    if (!user) {
      throw new HttpError(400, 'No record exists against provided input');
    }
    const { investor } = user;
    const investorCard = await this.investorPaymentOptionsRepository.fetchInvestorCard(
      investor.investorId,
      false,
    );
    if (investorCard) {
      await this.investorPaymentOptionsRepository.remove(investorCard);
      await northCapitalService.deleteCreditCard(accountId, '');
    }

    return northCapitalService.linkCreditCard(accountId);
  }

  async getLinkedCreditCard(getLinkedCreditCardDTO: GetLinkedCreditCardDTO) {
    const userId = getLinkedCreditCardDTO.getUserId();
    const accountId = getLinkedCreditCardDTO.getAccountId();
    const cardDetails = await northCapitalService.getLinkedCreditCard(accountId);
    const user = await this.userRepository.fetchById(userId, false);
    if (!user) {
      throw new HttpError(400, 'No record exists against provided input');
    }
    const { investor } = user;
    const investorCard = await this.investorPaymentOptionsRepository.fetchInvestorCard(
      investor.investorId,
      false,
    );
    if (investorCard) {
      await this.investorPaymentOptionsRepository.remove(investorCard);
    }
    const cardType = CardType.createFromValue(cardDetails.cardType);
    const cardInput = {
      creditCardName: 'Credit Card',
      cardType: cardType.getValue(),
      lastFour: cardDetails.creditCardNumber,
      isStripeCard: false,
    };
    const card = InvestorCard.create(cardInput);
    const input = {
      type: PaymentOptionType.Card(),
      investorId: investor.investorId,
      card: card,
    };
    const investorPaymentOptions = InvestorPaymentOptions.create(input);

    await this.investorPaymentOptionsRepository.add(investorPaymentOptions);
    return true;
  }
}

export default LinkCreditCardService;
