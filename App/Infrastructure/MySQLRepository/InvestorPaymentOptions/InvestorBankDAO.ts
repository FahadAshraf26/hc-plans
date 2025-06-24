import models from '../../Model';
import InvestorBank from '@domain/InvestorPaymentOptions/InvestorBank';
import DatabaseError from '../../Errors/DatabaseError';
import InvestorBankMap from '../../../Domain/InvestorPaymentOptions/Mappers/InvestorBankMap';
import { IInvestorBankDAO } from '@domain/InvestorPaymentOptions/IInvestorBankDAO';
import { injectable } from 'inversify';

const { InvestorBankModel } = models;

@injectable()
class InvestorBankDAO implements IInvestorBankDAO {
  async add(investorBank: InvestorBank) {
    try {
      await InvestorBankModel.create(InvestorBankMap.toPersistence(investorBank));
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchByPaymentOptionsId(paymentOptionId: string) {
    try {
      const investorBankObj = await InvestorBankModel.findOne({
        where: {
          investorPaymentOptionsId: paymentOptionId,
        },
      });

      if (!investorBankObj) {
        return false;
      }

      return InvestorBankMap.toDomain(investorBankObj);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchById(investorBankId: string) {
    try {
      const investorBankObj = await InvestorBankModel.findOne({
        where: {
          investorBankId,
        },
      });

      if (!investorBankObj) {
        return false;
      }

      return InvestorBankMap.toDomain(investorBankObj);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async remove(investorBank: InvestorBank, hardDelete: boolean = false) {
    try {
      await InvestorBankModel.destroy({
        where: {
          investorBankId: investorBank.getInvestorBankId(),
        },
        force: hardDelete,
      });
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async update(bank: InvestorBank) {
    try {
      await InvestorBankModel.update(InvestorBankMap.toPersistence(bank), {
        where: {
          investorBankId: bank.getInvestorBankId(),
        },
      });
      return true;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async upsert(bankEntity: InvestorBank) {
    const bank = await InvestorBankModel.findOne({
      where: {
        investorBankId: bankEntity.getInvestorBankId(),
      },
    });

    if (bank) {
      return this.update(bankEntity);
    }

    return this.add(bankEntity);
  }
}

export default InvestorBankDAO;
