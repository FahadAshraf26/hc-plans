import CreateToSDTO from '@application/ToS/CreateToSDTO';
import GetAllToSDTO from '@application/ToS/GetAllToSDTO';
import ToS from '@domain/Core/ToS/ToS';
import FindToSDTO from '@application/ToS/FindToSDTO';
import UpdateToSDTO from '@application/ToS/UpdateToSDTO';
import RemoveToSDTO from '@application/ToS/RemoveToSDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';

export const IToSServiceId = Symbol.for('IToSService');

type removeResponse = {
  status: string;
  message: string;
};
export interface IToSService {
  createToS(createToSDTO: CreateToSDTO): Promise<boolean>;
  getAllToS(getAllToSDTO: GetAllToSDTO): Promise<PaginationDataResponse<ToS>>;
  findToS(findToSDTO: FindToSDTO): Promise<ToS>;
  updateToS(updateToSDTO: UpdateToSDTO): Promise<boolean>;
  removeToS(removeToSDTO: RemoveToSDTO): Promise<removeResponse>;
}
