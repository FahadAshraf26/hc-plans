import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import models from '../Model';
import { injectable } from 'inversify';
import PromotionText from '@domain/Core/PromotionText/PromotionText';
import { IPromotionTextRepository } from '@domain/Core/PromotionText/IPromotionTextRepository';

const { PromotionTextsModel } = models;

@injectable()
class PromotionTextRepository extends BaseRepository
  implements IPromotionTextRepository {
  constructor() {
    super(
      PromotionTextsModel,
      'promotionTextId', 
        PromotionText, 
    );
  }

  async fetchLatestRecord(): Promise<PromotionText | null> {
    const configuration = await PromotionTextsModel.findOne({
      order: [['createdAt', 'DESC']],
    });
    if (configuration) {
      return PromotionText.createFromObj(configuration);
    } else {
      return null;
    }
  }
}

export default PromotionTextRepository;
