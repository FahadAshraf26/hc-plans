import FindCampaignDTO from '@application/Campaign/findCampaign/FindCampaignDTO';
import Campaign from '@domain/Core/Campaign/Campaign';

export const IFindCampaignUseCaseId = Symbol.for('IFindCampaignUseCase');
export interface IFindCampaignUseCase {
  execute(findCampaignDTO: FindCampaignDTO): Promise<Campaign>;
}
