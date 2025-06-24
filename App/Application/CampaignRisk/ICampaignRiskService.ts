import CreateCampaignRiskDTO from './CreateCampaignRiskDTO';
import FindCampaignRiskDTO from './FindCampaignRiskDTO';
import GetCampaignRiskDTO from './GetCampaignRiskDTO';
import RemoveCampaignRiskDTO from './RemoveCampaignRiskDTO';
import UpdateCampaignRiskDTO from './UpdateCampaignRiskDTO';
import CampaignRisk from '@domain/Core/CampaignRisk/CampaignRisk';
import {PaginationDataResponse} from "@domain/Utils/PaginationData";

export const ICampaignRiskServiceId = Symbol.for('ICampaignRiskService');

export interface ICampaignRiskService {
    createCampaignRisk(createCampaignRiskDTO: CreateCampaignRiskDTO): Promise<boolean>;

    getCampaignRisk(getCampaignRiskDTO: GetCampaignRiskDTO): Promise<PaginationDataResponse<CampaignRisk>>;

    findCampaignRisk(findCampaignRiskDTO: FindCampaignRiskDTO): Promise<CampaignRisk>;

    updateCampaignRisk(updateCampaignRiskDTO: UpdateCampaignRiskDTO): Promise<boolean>;

    removeCampaignRisk(removeCampaignRiskDTO: RemoveCampaignRiskDTO): Promise<boolean>;

    recreateRisks(campaignId: string): Promise<boolean>;
}
