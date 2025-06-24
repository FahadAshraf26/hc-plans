import { ICampaignOfferingChangeRepository } from '@domain/Core/CampaignOfferingChange/ICampaignOfferingChangeRepository';
import models from '../Model';
const CampaignOfferingChange = require('@domain/Core/CampaignOfferingChange/CampaignOfferingChange');
import BaseRepository from './BaseRepository';
const { CampaignOfferingChangeModel } = models;

class CampaignOfferingChangeRepository extends BaseRepository
  implements ICampaignOfferingChangeRepository {
  constructor() {
    super(
      CampaignOfferingChangeModel,
      'campaignOfferingChangeId',
      CampaignOfferingChange,
    );
  }
}

export default CampaignOfferingChangeRepository;
