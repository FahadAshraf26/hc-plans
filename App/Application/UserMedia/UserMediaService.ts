import { inject, injectable } from 'inversify';

import HttpException from '../../Infrastructure/Errors/HttpException';
import {
  IUserMediaService,
  IUserMediaServiceId,
} from '@application/UserMedia/IUserMediaService';
import {
  IUserMediaRepository,
  IUserMediaRepositoryId,
} from '@domain/Core/UserMedia/IUserMediaRepository';

@injectable()
class UserMediaService implements IUserMediaService {
  constructor(
    @inject(IUserMediaRepositoryId) private userMediaRepository: IUserMediaRepository,
  ) {}
  async createUserMedia(createUserMediaDTO) {
    const addResult = await this.userMediaRepository.add(
      createUserMediaDTO.getUserMedia(),
    );

    if (!addResult) {
      throw new HttpException(400, 'failed to create user media');
    }

    return addResult;
  }

  async findUserMedia(findUserMediaDTO) {
    const userMedia = await this.userMediaRepository.fetchById(
      findUserMediaDTO.getUserMediaId(),
    );

    if (!userMedia) {
      throw new HttpException(404, 'no such media');
    }
  }

  async getUserMedia(getUserMediaDTO) {
    const result = await this.userMediaRepository.fetchAll({
      paginationOptions: getUserMediaDTO.getPaginationOptions(),
      showTrashed: getUserMediaDTO.isShowTrashed(),
      query: getUserMediaDTO.getQuery(),
    });

    return result.getPaginatedData();
  }

  async deleteUserMedia(deleteUserMediaDTO) {
    const userMedia = await this.userMediaRepository.fetchById(
      deleteUserMediaDTO.getUserMediaId(),
    );

    if (!userMedia) {
      throw new HttpException(404, 'no such media');
    }

    const deleteResult = await this.userMediaRepository.remove(
      userMedia,
      deleteUserMediaDTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'delete user media failed');
    }

    return deleteResult;
  }
}

export default UserMediaService;
