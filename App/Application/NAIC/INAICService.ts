import CreateNAICDTO from '@application/NAIC/CreateNAICDTO';
import FindNAICDTO from '@application/NAIC/FindNAICDTO';
import NAIC from '@domain/Core/NAIC/NAIC';
import UpdateNAICDTO from '@application/NAIC/UpdateNAICDTO';
import RemoveNAICDTO from '@application/NAIC/RemoveNAICDTO';
import GetNAICDTO from '@application/NAIC/GetNAICDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';

export const INAICServiceId = Symbol.for('INAICService');
export interface INAICService {
  createNAIC(createNAICDTO: CreateNAICDTO): Promise<boolean>;
  findNAIC(findNAICDTO: FindNAICDTO): Promise<NAIC>;
  updateNAIC(updateNAICDTO: UpdateNAICDTO): Promise<boolean>;
  removeNAIC(removeNAICDTO: RemoveNAICDTO): Promise<boolean>;
  getNAIC(getNAICDTO: GetNAICDTO): Promise<PaginationDataResponse<NAIC>>;
}
