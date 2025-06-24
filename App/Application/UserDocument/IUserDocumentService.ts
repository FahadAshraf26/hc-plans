import GetUserDocumentsDTO from '@application/UserDocument/GetUserDocumentsDTO';
import { PaginationDataResponse } from '@domain/Utils/PaginationData';
import UserDocument from '@domain/Core/UserDocument/UserDocument';
import FindUserDocumentDTO from '@application/UserDocument/FindUserDocumentDTO';
import UpdateUserDocumentDTO from '@application/UserDocument/UpdateUserDocumentDTO';
import RemoveUserDocumentDTO from '@application/UserDocument/RemoveUserDocumentDTO';
import CreateUserDocumentDTO from '@application/UserDocument/CreateUserDocumentDTO';
import CreateMultipleUserDocumentDTO from './CreateMutlipleUserDocumentDTO';

export const IUserDocumentServiceId = Symbol.for('IUserDocumentService');
type multipleDocumentResponse = {
  status: string;
  message: string;
};
export interface IUserDocumentService {
  getUserDocuments(
    getUserDocumentsDTO: GetUserDocumentsDTO,
  ): Promise<PaginationDataResponse<UserDocument>>;
  findUserDocument(findUserDocumentDTO: FindUserDocumentDTO): Promise<UserDocument>;
  updateUserDocument(updateUserDocumentDTO: UpdateUserDocumentDTO): Promise<boolean>;
  removeUserDocument(removeUserDocumentDTO: RemoveUserDocumentDTO): Promise<boolean>;
  createUserDocument(createUserDocumentDTO: CreateUserDocumentDTO): Promise<boolean>;
  createMultipleUserDocument(
    createMultipleUserDocumentDTO: CreateMultipleUserDocumentDTO,
  ): Promise<multipleDocumentResponse>;
  getCloudSignedDocumentUrl(fileName): Promise<any>;
}
