import PaymentOptionType from '../PaymentOptionType';
import InvestorPaymentOptions from '../InvestorPaymentOptions';
import InvestorBank from '../InvestorBank';
import InvestorCardMap from './InvestorCardMap';
import InvestorBankMap from './InvestorBankMap';

type PaymentOptionDTO = {
  investorPaymentOptionsId: string;
  type: PaymentOptionType;
  investorId: string;
  bank?: ReturnType<typeof InvestorBankMap.toDTO>;
  card?: ReturnType<typeof InvestorCardMap.toDTO>;
  createdAt?: Date;
};

class PaymentOptionsMap {
  static toDomain(paymentOptionsObject) {
    const paymentOptionType = PaymentOptionType.createFromValue(
      paymentOptionsObject.type,
    );
    if (paymentOptionType.getValue() === PaymentOptionType.paymentOptionTypes.card) {
      const cardObj =
        paymentOptionsObject.card && paymentOptionsObject.card.dataValues
          ? paymentOptionsObject.card.dataValues
          : {};
      const card = InvestorCardMap.toDomain(cardObj);
      return InvestorPaymentOptions.create(
        {
          type: paymentOptionType,
          card,
          investorId: paymentOptionsObject.investorId
        },
        paymentOptionsObject.investorPaymentOptionsId,
        paymentOptionsObject.createdAt,
      );
    }

    if (paymentOptionType.getValue() === PaymentOptionType.paymentOptionTypes.bank) {
      const bankObj =
        paymentOptionsObject.bank && paymentOptionsObject.bank.dataValues
          ? paymentOptionsObject.bank.dataValues
          : {};
      const bank = InvestorBankMap.toDomain(bankObj);
      return InvestorPaymentOptions.create(
        {
          type: paymentOptionType,
          bank,
          investorId: paymentOptionsObject.investorId,
        },
        paymentOptionsObject.investorPaymentOptionsId,
        paymentOptionsObject.createdAt,
      );
    }
  }

  static toPersistence(paymentOptionsEntity) {
    return {
      investorPaymentOptionsId: paymentOptionsEntity.getInvestorPaymentOptionsId(),
      type: paymentOptionsEntity.getType(),
      investorId: paymentOptionsEntity.getInvestorId(),
    };
  }

  static toDTO(paymentOptionsEntity) {
    const response: PaymentOptionDTO = {
      investorPaymentOptionsId: paymentOptionsEntity.getInvestorPaymentOptionsId(),
      type: paymentOptionsEntity.getType(),
      investorId: paymentOptionsEntity.getInvestorId(),
      createdAt: paymentOptionsEntity.getCreatedAt(),
    };

    if (paymentOptionsEntity.isBank()) {
      response.bank = InvestorBankMap.toDTO(paymentOptionsEntity.getBank());
    }

    if (paymentOptionsEntity.isCard()) {
      response.card = InvestorCardMap.toDTO(paymentOptionsEntity.getCard());
    }

    return response;
  }
}

export default PaymentOptionsMap;
