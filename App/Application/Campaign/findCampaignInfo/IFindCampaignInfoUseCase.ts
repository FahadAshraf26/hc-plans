import FindCampaignInfoDTO from '@application/Campaign/findCampaignInfo/FindCampaignInfoDTO';
import Campaign from '@domain/Core/Campaign/Campaign';

export const IFindCampaignInfoUseCaseId = Symbol.for('IFindCampaignInfoUseCase');
export interface IFindCampaignInfoUseCase {
  execute(findCampaignInfoDTO: FindCampaignInfoDTO): Promise<Campaign>;
}
