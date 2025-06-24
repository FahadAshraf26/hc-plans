import DeleteProjectionReturnsDTO from './DeleteProjectionReturnsDTO';
import UploadProjectionReturnsDTO from './UploadProjectionReturnsDTO';

export const IProjectionReturnsServiceId = Symbol.for('IProjectionReturnsService');

export interface IProjectionReturnsService {
  uploadProjectionReturns(
    uploadProjectionReturnsDTO: UploadProjectionReturnsDTO,
  ): Promise<any>;
  deleteProjectionReturns(
    deleteProjectionReturnsDTO: DeleteProjectionReturnsDTO,
  ): Promise<any>;
}
