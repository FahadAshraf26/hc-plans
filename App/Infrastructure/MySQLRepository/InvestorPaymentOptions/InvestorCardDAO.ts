import models from '../../Model';
import DatabaseError from '../../Errors/DatabaseError';
import InvestorCardMap from '../../../Domain/InvestorPaymentOptions/Mappers/InvestorCardMap';
import InvestorCard from '@domain/InvestorPaymentOptions/InvestorCard';
import { IInvestorCardDAO } from '@domain/InvestorPaymentOptions/IInvestorCardDAO';
import { injectable } from 'inversify';
const { InvestorCardModel } = models;

@injectable()
class InvestorCardDAO implements IInvestorCardDAO {
  async add(investorCard: InvestorCard) {
    try {
      await InvestorCardModel.create(InvestorCardMap.toPersistence(investorCard));
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchByPaymentOptionsId(paymentOptionId: string) {
    try {
      const investorCardObj = await InvestorCardModel.findOne({
        where: {
          investorPaymentOptionsId: paymentOptionId,
        },
      });

      if (!investorCardObj) {
        return false;
      }

      return InvestorCardMap.toDomain(investorCardObj);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchById(investorCardId: string) {
    try {
      const investorCardObj = await InvestorCardModel.findOne({
        where: {
          investorCardId,
        },
      });

      if (!investorCardObj) {
        return false;
      }

      return InvestorCardMap.toDomain(investorCardObj);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async remove(investorCard: InvestorCard, hardDelete: boolean = false) {
    try {
      await InvestorCardModel.destroy({
        where: {
          investorCardId: investorCard.getInvestorCardId(),
        },
        force: hardDelete,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
}

export default InvestorCardDAO;
