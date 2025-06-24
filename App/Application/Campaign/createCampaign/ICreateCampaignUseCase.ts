import CreateCampaignDTO from '@application/Campaign/createCampaign/CreateCampaignDTO';

export const ICreateCampaignUseCaseId = Symbol.for('ICreateCampaignUseCase');
export interface ICreateCampaignUseCase {
  execute(createCampaignDTO: CreateCampaignDTO): Promise<boolean>;
}
