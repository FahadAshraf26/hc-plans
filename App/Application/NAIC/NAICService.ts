import { inject, injectable } from 'inversify';
import HttpException from '../../Infrastructure/Errors/HttpException';
import { INAICRepository, INAICRepositoryId } from '@domain/Core/NAIC/INAICRepository';
import { INAICService } from '@application/NAIC/INAICService';

@injectable()
class NAICService implements INAICService {
  constructor(@inject(INAICRepositoryId) private naicRepository: INAICRepository) {}
  /**
   *
   * @param {CreateNAICDTO} createNAICDTO
   */
  async createNAIC(createNAICDTO) {
    const createResult = await this.naicRepository.add(createNAICDTO.getNAIC());

    if (!createResult) {
      throw new HttpException(400, 'create naic failed');
    }

    return createResult;
  }

  /**
   *
   * @param {FindNAICDTO} findNAICDTO
   */
  async findNAIC(findNAICDTO) {
    const naic = await this.naicRepository.fetchById(findNAICDTO.getNAICId());

    if (!naic) {
      throw new HttpException(404, 'no naic found');
    }

    return naic;
  }

  /**
   *
   * @param {UpdateNAICDTO} updateNAICDTO
   */
  async updateNAIC(updateNAICDTO) {
    const naic = await this.naicRepository.fetchById(updateNAICDTO.getNAICId());

    if (!naic) {
      throw new HttpException(404, 'no naic found');
    }

    const updateResult = await this.naicRepository.update(updateNAICDTO.getNAIC());

    if (!updateResult) {
      throw new HttpException(400, 'update naic failed');
    }

    return updateResult;
  }

  /**
   *
   * @param {removeNAICDTO} removeNAICDTO
   */
  async removeNAIC(removeNAICDTO) {
    const naic = await this.naicRepository.fetchById(removeNAICDTO.getNAICId());

    if (!naic) {
      throw new HttpException(404, 'no naic found');
    }

    const deleteResult = await this.naicRepository.remove(naic);

    if (!deleteResult) {
      throw new HttpException(400, 'delete naic failed');
    }

    return deleteResult;
  }

  /**
   *
   * @param {getNAICDTO} getNAICDTO
   */
  async getNAIC(getNAICDTO) {
    const result = await this.naicRepository.fetchAll({
      paginationOptions: getNAICDTO.getPaginationOptions(),
      query: getNAICDTO.getQuery(),
    });

    return result.getPaginatedData();
  }
}

export default NAICService;
