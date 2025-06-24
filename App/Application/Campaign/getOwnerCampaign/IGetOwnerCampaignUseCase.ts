import GetOwnerCampaignDTO from '@application/Campaign/getOwnerCampaign/GetOwnerCampaignDTO';

export const IGetOwnerCampaignUseCaseId = Symbol.for('IGetOwnerCampaignUseCase');
type response = {
  status: string;
  paginationInfo;
  data: Array<any>;
};
export interface IGetOwnerCampaignUseCase {
  execute(dto: GetOwnerCampaignDTO): Promise<response>;
}
