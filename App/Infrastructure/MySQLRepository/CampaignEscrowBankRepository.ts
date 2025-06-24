import models from '../Model';
const { CampaignEscrowBankModel, CampaignModel, IssuerModel } = models;
import CampaignEscrowBank from '../../Domain/Core/CampaignEscrowBank/CampaignEscrowBank';
import BaseRepository from './BaseRepository';
import DatabaseError from '../Errors/DatabaseError';
import { ICampaignEscrowBankRepository } from '@domain/Core/CampaignEscrowBank/ICampaignEscrowBankRepository';
import { injectable } from 'inversify';
@injectable()
class CampaignEscrowBankRepository extends BaseRepository
  implements ICampaignEscrowBankRepository {
  constructor() {
    super(CampaignEscrowBankModel, 'campaignEscrowBankId', CampaignEscrowBankModel);
  }

  /**
   * fetchById(campaignId) fetch campaignEscrowBank By Id
   * @param {string} campaignId
   * @returns {CampaignEscrowBank}
   */
  async fetchByCampaignId(campaignId): Promise<CampaignEscrowBank> {
    return await super.fetchOneByCustomCritera({
      whereConditions: { campaignId },
    });
  }

  /**
   * upsert campaign escrow bank
   * @param {CampaignEscrowBank} campaignEscrowBank
   * @returns boolean
   */
  async update(campaignEscrowBank): Promise<boolean> {
    try {
      const campaignEscrowBankObj = await super.fetchById(
        campaignEscrowBank.campaignEscrowBankId,
      );

      if (campaignEscrowBankObj) {
        return await super.update(campaignEscrowBank);
      }

      return await super.add(campaignEscrowBank);
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  /**
   * It will fetch bank details by dwolla source id
   * @param dwollaSourceId
   * @returns {Promise<Model>}
   */
  async fetchByDwollaSourceId(dwollaSourceId): Promise<CampaignEscrowBank> {
    return await CampaignEscrowBankModel.findOne({
      where: {
        dwollaSourceId,
      },
      include: [
        {
          model: CampaignModel,
          as: 'campaign',
          include: [
            {
              model: IssuerModel,
              as: 'issuer',
            },
          ],
        },
      ],
    });
  }
}

export default CampaignEscrowBankRepository;
