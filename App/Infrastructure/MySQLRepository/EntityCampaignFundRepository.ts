import models from '../Model';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import { IEntityCampaignFundRepository } from '@domain/Core/EntityCampaignFund/IEntityCampaignFundRepository';
import EntityCampaignFund  from '@domain/Core/EntityCampaignFund/EntityCampaignFund';

@injectable()
class EntityIntermediaryRepository extends BaseRepository
  implements IEntityCampaignFundRepository {
  constructor() {
    super(models.EntityCampaignFundModel, 'entityCampaignFundId', EntityCampaignFund);
  }

  async fetchEntitesByUserId(userId: string) {
    return models.EntityIntermediaryModel.findAll({
      where: { userId },
      attributes: ['entityIntermediaryId', 'operatorAgreementApproved'],
      include: [
        {
          model: models.IssuerModel,
        },
      ],
    });
  }
}

export default EntityIntermediaryRepository;
