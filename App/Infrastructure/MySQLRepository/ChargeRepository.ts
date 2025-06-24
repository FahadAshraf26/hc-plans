import { IChargeRepository } from '@domain/Core/Charge/IChargeRepository';
import models from '../Model';
import Charge from '../../Domain/Core/Charge/Charge';
import BaseRepository from './BaseRepository';
import { ChargeStatus } from '../../Domain/Core/ValueObjects/ChargeStatus';
const { ChargeModel, CampaignFundModel, Sequelize } = models;
const { Op } = Sequelize;

class ChargeRepository extends BaseRepository implements IChargeRepository {
  constructor() {
    super(ChargeModel, 'chargeId', Charge);
  }

  /**
   * Fetch all Charges from database with pagination
   * @returns Charge[]
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll(paginationOptions, showTrashed = false) {
    return super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }

  async fetchByDwollaChargeId(dwollaChargeId) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        dwollaChargeId,
      },
    });
  }

  async fetchByReferenceNumber(referenceNumber) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        referenceNumber,
      },
    });
  }

  async refundCampaignCharges(campaignId) {
    const campaignCharges = await ChargeModel.findAll({
      attributes: ['chargeId'],
      include: [
        {
          model: CampaignFundModel,
          as: 'investmentCharge',
          where: {
            campaignId,
          },
          attributes: ['campaignFundId', 'chargeId'],
          required: true,
        },
      ],
      whereConditions: {
        chargeStatus: {
          [Op.in]: [ChargeStatus.SUCCESS, ChargeStatus.PENDING],
        },
        refunded: { [Op.or]: [null, false] },
      },
      raw: true,
    });
    const charges = campaignCharges.map((campaignCharge) => campaignCharge.chargeId);

    return super.update(
      {
        refunded: true,
        refundRequestDate: new Date(),
      },
      {
        chargeId: { [Op.in]: charges },
      },
    );
  }
}

export default ChargeRepository;
