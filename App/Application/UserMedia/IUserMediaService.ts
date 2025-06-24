import UserMedia from '@domain/Core/UserMedia/UserMedia';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';

export const IUserMediaServiceId = Symbol.for('IUserMediaService');
export interface IUserMediaService {
  createUserMedia(createUserMediaDTO): Promise<boolean>;
  findUserMedia(findUserMediaDTO): Promise<void>;
  getUserMedia(getUserMediaDTO): Promise<PaginationDataResponse<UserMedia>>;
  deleteUserMedia(deleteUserMediaDTO): Promise<boolean>;
}
