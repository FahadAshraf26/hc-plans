import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import UserDocument from '@domain/Core/UserDocument/UserDocument';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IUserDocumentRepositoryId = Symbol.for('IUserDocumentRepository');
type userDocumentOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};

type fetchByUserDocumentOptions = { showTrashed: boolean; query: string,isAdminRequest?: boolean };
export interface IUserDocumentRepository extends IBaseRepository {
  fetchAll({
    paginationOptions,
    showTrashed,
  }: userDocumentOptions): Promise<PaginationData<UserDocument>>;
  fetchByUser(
    userId: string,
    paginationOptions: PaginationOptions,
    options: fetchByUserDocumentOptions,
  ): Promise<PaginationData<UserDocument>>;
  fetchDocumentCount(
    userId: string,
    documentType: string,
    campaignId: string,
  ): Promise<any>;
}
