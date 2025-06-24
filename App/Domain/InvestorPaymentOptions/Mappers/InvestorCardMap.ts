import CardType from '../CardType';
import InvestorCard from '../InvestorCard';

class InvestorCardMap {
  static toDomain(investorCardObj) {
    const cardType = CardType.createFromValue(investorCardObj.cardType);
    return InvestorCard.create(
      {
        ...investorCardObj,
        cardType,
      },
      investorCardObj.investorCardId,
    );
  }

  static toPersistence(investorCardEntity) {
    return {
      investorPaymentOptionsId: investorCardEntity.getParentId(),
      investorCardId: investorCardEntity.getInvestorCardId(),
      creditCardName: investorCardEntity.getCardName(),
      cardType: investorCardEntity.getCardType(),
      lastFour: investorCardEntity.getLastFour(),
      isStripeCard: investorCardEntity.getIsStripeCard(),
    };
  }

  static toDTO(investorCardEntity) {
    return {
      investorCardId: investorCardEntity.getInvestorCardId(),
      creditCardName: investorCardEntity.getCardName(),
      cardType: investorCardEntity.getCardType(),
      lastFour: investorCardEntity.getLastFour(),
      isStripeCard: investorCardEntity.getIsStripeCard(),
      createdAt: investorCardEntity.getCreatedAt(),
      updatedAt: investorCardEntity.getUpdatedAt(),
      deletedAt: investorCardEntity.getDeletedAt(),
    };
  }
}

export default InvestorCardMap;
