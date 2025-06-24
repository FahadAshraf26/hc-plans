import CreateCampaignFundDTO from '@application/CampaignFund/createCampaignFund/CreateCampaignFundDTO';

export const ICreateCampaignFundUseCaseId = Symbol.for('ICreateCampaignFundUseCase');
export interface ICreateCampaignFundUseCase {
  execute(dto: CreateCampaignFundDTO): Promise<any>;
}
