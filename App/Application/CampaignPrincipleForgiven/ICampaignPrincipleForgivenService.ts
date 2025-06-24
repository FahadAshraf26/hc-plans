import CreateCampaignPrincipleForgivenDTO from './CreateCampaignPrincipleForgivenDTO';

export const ICampaignPrincipleForgivenServiceId = Symbol.for(
  'ICampaignPrincipleForgivenService',
);

export interface ICampaignPrincipleForgivenService {
  createCampaignPrincipleForgiven(
    createCampaignPrincipleForgivenDTO: CreateCampaignPrincipleForgivenDTO,
  ): Promise<any>;
}
