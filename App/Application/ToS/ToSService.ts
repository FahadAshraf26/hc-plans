import httpException from '../../Infrastructure/Errors/HttpException';
import CreateToSDTO from './CreateToSDTO';
import GetAllToSDTO from './GetAllToSDTO';
import FindToSDTO from './FindToSDTO';
import RemoveToSDTO from './RemoveToSDTO';
import UpdateToSDTO from './UpdateToSDTO';
import { inject, injectable } from 'inversify';
import { IToSRepository, IToSRepositoryId } from '@domain/Core/ToS/IToSRepository';
import { IToSService } from '@application/ToS/IToSService';

@injectable()
class ToSService implements IToSService {
  constructor(@inject(IToSRepositoryId) private tosRepository: IToSRepository) {}
  /**\
   *
   * @param {CreateToSDTO} createToSDTO
   * @return {Promise<void>}
   */
  async createToS(createToSDTO: CreateToSDTO) {
    try {
      const tos = await this.tosRepository.add(createToSDTO.getToS());

      if (!tos) {
        throw new httpException(400, 'Unable to create tos');
      }

      return tos;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {GetAllToSDTO} getAllToSDTO
   * @return {Promise<void>}
   */
  async getAllToS(getAllToSDTO: GetAllToSDTO) {
    try {
      const result = await this.tosRepository.fetchAll({
        paginationOptions: getAllToSDTO.getPaginationOptions(),
        showTrashed: getAllToSDTO.isShowTrashed(),
      });

      return result.getPaginatedData();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {FindToSDTO} findToSDTO
   * @return {Promise<void>}
   */
  async findToS(findToSDTO: FindToSDTO) {
    try {
      const tos = await this.tosRepository.fetchById(findToSDTO.getToSId());

      if (!tos) {
        throw new httpException(404, 'ToS not Found');
      }

      return tos;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {UpdateToSDTO} updateToSDTO
   * @return {Promise<boolean>}
   */
  async updateToS(updateToSDTO: UpdateToSDTO) {
    try {
      const tos = await this.tosRepository.update(updateToSDTO.getToS());

      if (!tos) {
        throw new httpException(400, 'ToS update failed');
      }

      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {RemoveToSDTO} removeToSDTO
   * @return {Promise<{message: string}>}
   */
  async removeToS(removeToSDTO: RemoveToSDTO) {
    try {
      const tos = await this.tosRepository.fetchById(removeToSDTO.getToSId());
      if (!tos) {
        throw new httpException(404, 'ToS not found');
      }

      const result = await this.tosRepository.remove(
        tos,
        removeToSDTO.shouldHardDelete(),
      );

      if (!result) {
        throw new httpException(400, 'ToS delete failed');
      }

      return { status: 'success', message: 'Deleted Successfully' };
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default ToSService;
