import CreateCampaignNotesDTO from '@application/CampaignNotes/CreateCampaignNotesDTO';
import GetCampaignNotesDTO from '@application/CampaignNotes/GetCampaignNotesDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import CampaignNotes from '@domain/Core/CampaignNotes/CampaignNotes';
import FindCampaignNotesDTO from '@application/CampaignNotes/FindCampaignNotesDTO';
import UpdateCampaignNotesDTO from '@application/CampaignNotes/UpdateCampaignNotesDTO';
import RemoveCampaignNotesDTO from '@application/CampaignNotes/RemoveCampaignNotesDTO';

export const ICampaignNotesServiceId = Symbol.for('ICampaignNotesService');
export interface ICampaignNotesService {
  createCampaignNotes(createCampaignNotesDTO: CreateCampaignNotesDTO): Promise<boolean>;
  getCampaignNotes(
    getCampaignNotesDTO: GetCampaignNotesDTO,
  ): Promise<PaginationDataResponse<CampaignNotes>>;
  findCampaignNotes(findCampaignNotesDTO: FindCampaignNotesDTO): Promise<CampaignNotes>;
  updateCampaignNotes(updateCampaignNotesDTO: UpdateCampaignNotesDTO): Promise<boolean>;
  removeCampaignNotes(removeCampaignNotesDTO: RemoveCampaignNotesDTO): Promise<boolean>;
}
