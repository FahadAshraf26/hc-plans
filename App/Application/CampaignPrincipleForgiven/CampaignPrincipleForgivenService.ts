import {
  ICampaignPrincipleForgivenRepositoryId,
  ICampaignPrincipleForgivenRepository,
} from '@domain/Core/CampaignPrincipleForgiven/ICampaignPrincipleForgivenRepository';
import { inject, injectable } from 'inversify';
import { ICampaignPrincipleForgivenService } from './ICampaignPrincipleForgivenService';
import CreateCampaignPrincipleForgivenDTO from './CreateCampaignPrincipleForgivenDTO';

@injectable()
class CampaignPrincipleForgivenService implements ICampaignPrincipleForgivenService {
  constructor(
    @inject(ICampaignPrincipleForgivenRepositoryId)
    private campaignPrincipleForgivenRepository: ICampaignPrincipleForgivenRepository,
  ) {}

  async createCampaignPrincipleForgiven(
    createCampaignPrincipleForgivenDTO: CreateCampaignPrincipleForgivenDTO,
  ) {
    const campaignPrincipleForgiven = createCampaignPrincipleForgivenDTO.getCampaignPrincipleForgiven();
    campaignPrincipleForgiven.setCampaignId(
      createCampaignPrincipleForgivenDTO.getCampaignId(),
    );
    campaignPrincipleForgiven.setInvestorId(
      createCampaignPrincipleForgivenDTO.getInvestorId(),
    );
    return this.campaignPrincipleForgivenRepository.add(campaignPrincipleForgiven);
  }
}

export default CampaignPrincipleForgivenService;
