import { ICampaignAddressRepository } from '@domain/Core/CampaignAddress/ICampaignAddressRepository';
import { injectable } from 'inversify';
import BaseRepository from './BaseRepository';
import Model from '@infrastructure/Model';
import CampaignAddress from '@domain/Core/CampaignAddress/CampaignAddress';

const { CampaignAddressModel } = Model;

@injectable()
class CampaignAddressRepository extends BaseRepository
  implements ICampaignAddressRepository {
  constructor() {
    super(CampaignAddressModel, 'campaignAddressId', CampaignAddress);
  }
}

export default CampaignAddressRepository;
