import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PromotionText from './PromotionText';

export const IPromotionTextRepositoryId = Symbol.for('IPromotionTextRepository');


export interface IPromotionTextRepository extends IBaseRepository {
  fetchLatestRecord(): Promise<PromotionText | null>;
}
