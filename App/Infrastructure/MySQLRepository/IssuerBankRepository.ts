import EncryptionService from '@infrastructure/Service/EncryptionService/EncryptionService';
import models from '../Model';
const { IssuerBankModel, IssuerModel, Sequelize, HoneycombDwollaCustomerModel } = models;
import { IIssuerBankRepository } from '@domain/Core/IssuerBank/IIssuerBankRepository';
const { Op } = Sequelize;

import IssuerBank from '../../Domain/Core/IssuerBank/IssuerBank';
import { IssuerBankOwner } from '@domain/Core/ValueObjects/IssuerBankOwner';
import BaseRepository from './BaseRepository';
import PaginationData from '@domain/Utils/PaginationData';

class IssuerBankRepository extends BaseRepository implements IIssuerBankRepository {
  constructor() {
    super(IssuerBankModel, 'issuerBankId', IssuerBank);
  }

  /**
   * fetchById(issuerId) fetch issuerBank By Id
   * @param {string} issuerId
   * @returns Object
   */
  async fetchByIssuerId({
    issuerId,
    paginationOptions,
    showTrashed = false,
    includeWallet = false,
  }) {
    const whereConditions = {
      issuerId,
    };
    const includes = [
      {
        model: IssuerModel,
        attributes: ['issuerId', 'email'],
        include: [
          {
            model: HoneycombDwollaCustomerModel,
            attributes: ['dwollaCustomerId', 'dwollaBalanceId'],
            where: { issuerId, deletedAt: null },
            required: false,
          },
        ],
      },
    ];

    const response = await IssuerBankModel.findAndCountAll({
      where: whereConditions,
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
      include: includes,
      paranoid: !showTrashed,
    });

    const paginationData = new PaginationData(paginationOptions, response.count);

    response.rows.forEach((entityObj) => {
      const issuerBank = IssuerBank.createFromObject(entityObj);
      if (entityObj.issuer.honeycombDwollaCustomers.length > 0) {
        const dwollaBalanceId =
          entityObj.issuer.honeycombDwollaCustomers[0].dataValues.dwollaBalanceId;
        issuerBank.setDwollaBalanceId(dwollaBalanceId);
      }

      return paginationData.addItem(issuerBank);
    });

    return paginationData;
  }

  async fetchIssuerBank(issuerId) {
    return await super.fetchOneByCustomCritera({
      whereConditions: {
        issuerId,
        accountOwner: IssuerBankOwner.ISSUER,
      },
      order: [['createdAt', 'desc']],
    });
  }

  /**
   *
   * @param {string} issuerId
   * @returns {IssuerBank}
   */
  async fetchIssuerWallet(issuerId) {
    return await super.fetchOneByCustomCritera({
      whereConditions: {
        issuerId,
        accountOwner: IssuerBankOwner.WALLET,
      },
      order: [['createdAt', 'desc']],
    });
  }

   /**
   * Fetch issuerBank by id and then update it
   * @param {IssuerBank} issuerBank
   * @returns boolean
   */
    async updateIssuerBank(issuerBank) {
      try {
        const issuerBankObj = await super.fetchById(issuerBank.issuerBankId);
  
        if (issuerBankObj) {
          return await super.update(issuerBank);
        }
        return await super.add(issuerBank);
      } catch (error) {
        throw Error(error);
      }
    }
  
  /**
   * Fetch issuerBank by id and then update it
   * @param {IssuerBank} issuerBank
   * @returns boolean
   */
  async updateIssuerBankByIssuerId(issuerBank) {
    try {
      return IssuerBankModel.update(issuerBank, {
        where: {
          issuerId: issuerBank.issuerId,
        },
      });
    } catch (error) {
      throw Error(error);
    }
  }

  async updateIssuerBankById(issuerBank) {
    try {
      return IssuerBankModel.update(issuerBank, {
        where: {
          issuerBankId: issuerBank.issuerBankId,
          issuerId: issuerBank.issuerId,
        },
      });
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * It will fetch bank details by dwolla source id
   * @param dwollaSourceId
   * @returns {Promise<Model>}
   */
  async fetchByDwollaSourceId(dwollaSourceId) {
    return IssuerBankModel.findOne({
      where: {
        dwollaSourceId,
      },
      include: [
        {
          model: IssuerModel,
          as: 'issuer',
        },
      ],
    });
  }

  async fetchLatestDeletedBankByIssuerIdExcludingWallet({
    issuerId,
    paginationOptions,
    showTrashed = false,
  }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: {
        issuerId,
        accountType: {
          [Op.ne]: 'wallet',
        },
      },
      order: [['deletedAt', 'DESC']],
    });
  }

  async fetchAllBanksByIssuerId(issuerId: string) {
    const banks = await IssuerBankModel.findAll({
      where: {
        issuerId,
        deletedAt: null,
      },
    });

    if (!banks) {
      return null;
    }

    const response = banks.map((bank) => {
      const issuerBank = IssuerBank.createFromObject(bank.dataValues);
      issuerBank.setAccountNumber(bank.dataValues.accountNumber);
      issuerBank.setRoutingNumber(bank.dataValues.routingNumber);
      return issuerBank;
    });

    return response;
  }
}

export default IssuerBankRepository;
