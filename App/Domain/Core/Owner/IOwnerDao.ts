import Owner from '../../../Domain/Core/Owner/Owner';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IOwnerDaoId = Symbol.for('IOwnerDao');

export interface IOwnerDao extends IBaseRepository {
  fetchByUserId(userId: string, showTrashed?: string | boolean): Promise<Owner>;
  upsert(owner: Owner): Promise<boolean>;
}
