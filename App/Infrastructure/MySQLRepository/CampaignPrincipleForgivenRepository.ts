import { injectable } from 'inversify';
import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import { ICampaignPrincipleForgivenRepository } from '@domain/Core/CampaignPrincipleForgiven/ICampaignPrincipleForgivenRepository';
import Model from '../Model';
import CampaignPrincipleForgiven from '@domain/Core/CampaignPrincipleForgiven/CampaignPrincipleForgiven';

const { CampaignPrincipleForgivenModel } = Model;

@injectable()
class CampaignPrincipleForgivenRepository extends BaseRepository
  implements ICampaignPrincipleForgivenRepository {
  constructor() {
    super(
      CampaignPrincipleForgivenModel,
      'campaignPrincipleForgivenId',
      CampaignPrincipleForgiven,
    );
  }
}

export default CampaignPrincipleForgivenRepository;
