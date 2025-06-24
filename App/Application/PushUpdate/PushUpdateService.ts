import HttpException from '../../Infrastructure/Errors/HttpException';
import { IPushUpdateService } from '@application/PushUpdate/IPushUpdateService';
import { inject, injectable } from 'inversify';
import {
  IReleaseRepository,
  IReleaseRepositoryId,
} from '@domain/Core/Release/IReleaseRepository';

@injectable()
class PushUpdateService implements IPushUpdateService {
  constructor(
    @inject(IReleaseRepositoryId) private releaseRepository: IReleaseRepository,
  ) {}
  /**
   * It will add new release
   * @param {CreateNewUpdateDTO} createNewUpdateDTO
   */
  async addNewRelease(createNewUpdateDTO) {
    const createResult = await this.releaseRepository.add(
      createNewUpdateDTO.getRelease(),
    );
    if (!createResult) {
      throw new HttpException(400, 'Push update failed');
    }
    return createResult;
  }

  /**
   * It will return latest release
   * @returns {Release}
   */
  async getLatestRelease() {
    const latestRelease = await this.releaseRepository.fetchOneByCustomCritera({
      order: [['createdAt', 'DESC']],
    });
    if (!latestRelease) {
      throw new HttpException(400, 'No release found.');
    }
    return latestRelease;
  }
}

export default PushUpdateService;
