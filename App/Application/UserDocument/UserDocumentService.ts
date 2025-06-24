import UserDocument from '@domain/Core/UserDocument/UserDocument';
import HttpException from '../../Infrastructure/Errors/HttpException';
import { unlink, exists } from 'fs';
import { promisify } from 'util';
import { inject, injectable } from 'inversify';
import {
  IUserDocumentRepository,
  IUserDocumentRepositoryId,
} from '@domain/Core/UserDocument/IUserDocumentRepository';
import GetUserDocumentsDTO from '@application/UserDocument/GetUserDocumentsDTO';
import FindUserDocumentDTO from '@application/UserDocument/FindUserDocumentDTO';
import UpdateUserDocumentDTO from '@application/UserDocument/UpdateUserDocumentDTO';
import RemoveUserDocumentDTO from '@application/UserDocument/RemoveUserDocumentDTO';
import CreateUserDocumentDTO from '@application/UserDocument/CreateUserDocumentDTO';
import { IUserDocumentService } from '@application/UserDocument/IUserDocumentService';
import CreateMultipleUserDocumentDTO from './CreateMutlipleUserDocumentDTO';
import {
  IStorageService,
  IStorageServiceId,
} from '@infrastructure/Service/StorageService/IStorageService';

const DeleteFile = promisify(unlink);
const FileExists = promisify(exists);

@injectable()
class UserDocumentService implements IUserDocumentService {
  constructor(
    @inject(IUserDocumentRepositoryId)
    private userDocumentRepository: IUserDocumentRepository,
    @inject(IStorageServiceId) private storageService: IStorageService,
  ) {}
  /**
   * get all user documents for a user
   * @param {object} getUserDocumentsDTO
   * @returns UserDocuments[]
   */
  async getUserDocuments(getUserDocumentsDTO: GetUserDocumentsDTO) {
    const result = await this.userDocumentRepository.fetchByUser(
      getUserDocumentsDTO.getUserId(),
      getUserDocumentsDTO.getPaginationOptions(),
      {
        showTrashed: getUserDocumentsDTO.isShowTrashed(),
        query: getUserDocumentsDTO.getQuery(),
        isAdminRequest: getUserDocumentsDTO.getIsAdminRequest(),
      },
    );

    return result.getPaginatedData();
  }

  /**
   * find a specific user document for a user
   * @param {object} findUserDocumentDTO
   * @returns UserDocument
   */
  async findUserDocument(findUserDocumentDTO: FindUserDocumentDTO) {
    const userDocument = await this.userDocumentRepository.fetchById(
      findUserDocumentDTO.getUserDocumentId(),
    );

    if (!userDocument) {
      throw new HttpException(
        404,
        'no user document record found against the provided input',
      );
    }

    return userDocument;
  }

  /**
   * update a user document
   * @param {object} updateUserDocumentDTO
   * @returns boolean
   */
  async updateUserDocument(updateUserDocumentDTO: UpdateUserDocumentDTO) {
    const userDocument = await this.userDocumentRepository.fetchById(
      updateUserDocumentDTO.getUserDocumentId(),
    );

    if (!userDocument) {
      throw new HttpException(
        404,
        'no user document record found against the provided input',
      );
    }

    // if new file uploaded , delete old
    if (userDocument.path !== updateUserDocumentDTO.getUserDocument().path) {
      const fileExists = await FileExists(userDocument.path);
      if (fileExists) {
        await DeleteFile(userDocument.path);
      }
    }

    const updateResult = await this.userDocumentRepository.update(
      updateUserDocumentDTO.getUserDocument(),
    );

    if (!updateResult) {
      throw new HttpException(400, 'user document update failed');
    }

    return updateResult;
  }

  /**
   * delete a user document
   * @param {object} removeUserDocumentDTO
   * @returns boolean
   */
  async removeUserDocument(removeUserDocumentDTO: RemoveUserDocumentDTO) {
    const userDocument = await this.userDocumentRepository.fetchById(
      removeUserDocumentDTO.getUserDocumentId(),
    );

    if (!userDocument) {
      throw new HttpException(
        404,
        'no user document record found against the provided input',
      );
    }

    const deleteResult = await this.userDocumentRepository.remove(
      userDocument,
      removeUserDocumentDTO.shouldHardDelete(),
    );
    if (removeUserDocumentDTO.shouldHardDelete()) {
      const fileExists = await FileExists(userDocument.path);
      if (fileExists) {
        await DeleteFile(userDocument.path);
      }
    }

    if (!deleteResult) {
      throw new HttpException(400, 'user document delete failed');
    }

    return deleteResult;
  }

  /**
   * create a user document
   * @param {object} createUserDocumentDTO
   * @returns boolean
   */
  async createUserDocument(createUserDocumentDTO: CreateUserDocumentDTO) {
    const createResult = await this.userDocumentRepository.add(
      createUserDocumentDTO.getUserDocument(),
    );

    if (!createResult) {
      throw new HttpException(400, 'user document create failed');
    }

    return createResult;
  }

  async createMultipleUserDocument(
    createMultipleUserDocumentDTO: CreateMultipleUserDocumentDTO,
  ) {
    for (let document of createMultipleUserDocumentDTO.getDocuments()) {
      const { originalname } = document;
      const ext = originalname.split('.');
      const userDocument = UserDocument.createFromDetail(
        createMultipleUserDocumentDTO.getUserId(),
        createMultipleUserDocumentDTO.getDocumentType(),
        createMultipleUserDocumentDTO.getName(),
        document.path,
        document.mimetype,
        ext[1],
      );

      await this.userDocumentRepository.add(userDocument);
    }
    return { status: 'success', message: 'user document created successfully' };
  }

  async getCloudSignedDocumentUrl(fileName) {
    return this.storageService.generateV4ReadSignedUrl(fileName);
  }
}

export default UserDocumentService;
