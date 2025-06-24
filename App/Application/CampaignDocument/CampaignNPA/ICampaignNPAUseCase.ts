import GetCampaignNPADTO from './GetCampaignNPADTO';

export const ICampaignNPAUseCaseId = Symbol.for('ICampaignNPAUseCase');

export interface ICampaignNPAUseCase {
  execute(getCampaignNPADTO: GetCampaignNPADTO): Promise<any>;
}
