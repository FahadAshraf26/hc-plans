import models from '../../Model';
import DatabaseError from '../../Errors/DatabaseError';
import PaymentOptionType from '../../../Domain/InvestorPaymentOptions/PaymentOptionType';
import PaymentOptionsMap from '../../../Domain/InvestorPaymentOptions/Mappers/PaymentOptionsMap';
import PaginationData from '../../../Domain/Utils/PaginationData';
import { inject, injectable } from 'inversify';
import InvestorPaymentOptions from '@domain/InvestorPaymentOptions/InvestorPaymentOptions';
import { IInvestorPaymentOptionsRepository } from '../../../Domain/InvestorPaymentOptions/IInvestorPaymentOptionsRepository';
import {
  IInvestorCardDAO,
  IInvestorCardDAOId,
} from '@domain/InvestorPaymentOptions/IInvestorCardDAO';
import {
  IInvestorBankDAO,
  IInvestorBankDAOId,
} from '@domain/InvestorPaymentOptions/IInvestorBankDAO';

const { InvestorPaymentOptionModel, InvestorBankModel, InvestorCardModel } = models;

@injectable()
class InvestorPaymentOptionsRepository implements IInvestorPaymentOptionsRepository {
  constructor(
    @inject(IInvestorCardDAOId) private investorCardDAO: IInvestorCardDAO,
    @inject(IInvestorBankDAOId) private investorBankDAO: IInvestorBankDAO,
  ) {}

  async add(investorPaymentOption: InvestorPaymentOptions) {
    try {
      await InvestorPaymentOptionModel.create(
        PaymentOptionsMap.toPersistence(investorPaymentOption),
      );

      if (investorPaymentOption.isCard()) {
        await this.investorCardDAO.add(investorPaymentOption.getCard());
      } else {
        await this.investorBankDAO.upsert(investorPaymentOption.getBank());
      }

      return true;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async fetchById(investorPaymentOptionsId: string) {
    try {
      const investorPaymentOptionsObj = await InvestorPaymentOptionModel.findOne({
        where: {
          investorPaymentOptionsId,
        },
        include: [
          {
            model: InvestorCardModel,
            as: 'card',
          },
          {
            model: InvestorBankModel,
            as: 'bank',
          },
        ],
      });

      if (!investorPaymentOptionsObj) {
        return;
      }

      if (investorPaymentOptionsObj.bank) {
        investorPaymentOptionsObj.bank.decrypt();
      }
      if (investorPaymentOptionsObj.card) {
        investorPaymentOptionsObj.card.decrypt();
      }

      return PaymentOptionsMap.toDomain(investorPaymentOptionsObj);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  /**
   *
   * @param investorId
   * @param paginationOptions
   * @param showTrashed
   * @returns {Promise<PaginationData>}
   */
  async fetchAllByInvestor({ investorId, paginationOptions, showTrashed = false }) {
    try {
      const { rows: all, count } = await InvestorPaymentOptionModel.findAndCountAll({
        where: {
          investorId,
        },
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        paranoid: !showTrashed,
        include: [
          {
            model: InvestorBankModel,
            as: 'bank',
            paranoid: !showTrashed,
          },
          {
            model: InvestorCardModel,
            as: 'card',
            paranoid: !showTrashed,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      const paginationData = new PaginationData(paginationOptions, count);

      all.forEach((row) => {
        if (row.bank) {
          row.bank.decrypt();
        }
        if (row.card) {
          row.card.decrypt();
        }
        paginationData.addItem(PaymentOptionsMap.toDomain(row));
      });

      return paginationData;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async fetchInvestorCard(investorId: string, isStripeCard = false) {
    const investorPaymentOptionsObj = await InvestorPaymentOptionModel.findOne({
      where: {
        investorId,
        type: PaymentOptionType.Card().getValue(),
      },
      include: [
        {
          model: InvestorCardModel,
          as: 'card',
          where: {
            isStripeCard,
          },
        },
      ],
    });

    if (!investorPaymentOptionsObj) {
      return;
    }

    if (investorPaymentOptionsObj.card) {
      investorPaymentOptionsObj.card.decrypt();
    }

    return PaymentOptionsMap.toDomain(investorPaymentOptionsObj);
  }

  async fetchInvestorBank(investorId: string) {
    const investorPaymentOptionsObj = await InvestorPaymentOptionModel.findOne({
      where: {
        investorId,
        type: PaymentOptionType.Bank().getValue(),
      },
      include: [
        {
          model: InvestorBankModel,
          as: 'bank',
        },
      ],
    });

    if (!investorPaymentOptionsObj) {
      return;
    }

    if (investorPaymentOptionsObj.bank) {
      investorPaymentOptionsObj.bank.decrypt();
    }

    return PaymentOptionsMap.toDomain(investorPaymentOptionsObj);
  }

  async updateBank(paymentOptions) {
    await InvestorPaymentOptionModel.update(paymentOptions, {
      where: { investorPaymentOptionsId: paymentOptions.investorPaymentOptionsId },
    });
    return true;
  }

  async remove(paymentOption, hardDelete = false) {
    await InvestorPaymentOptionModel.destroy({
      where: {
        investorPaymentOptionsId: paymentOption.investorPaymentOptionsId,
      },
      force: hardDelete,
    });

    if (paymentOption.isBank()) {
      await this.investorBankDAO.remove(paymentOption.getBank(), hardDelete);
    }

    if (paymentOption.isCard()) {
      await this.investorCardDAO.remove(paymentOption.getCard(), hardDelete);
    }
  }
}

export default InvestorPaymentOptionsRepository;
