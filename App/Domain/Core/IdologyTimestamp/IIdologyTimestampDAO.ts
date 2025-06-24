import PaginationData from '@domain/Utils/PaginationData';
import {IBaseRepository} from '@domain/Core/BaseEntity/IBaseRepository';
import IdologyTimestamp from './IdologyTimestamp';

export const IIdologyTimestampDAOId = Symbol.for('IIdologyTimestampDAO');

export interface IIdologyTimestampDAO extends IBaseRepository {
    fetchAll({paginationOptions, options}): Promise<PaginationData<IdologyTimestamp>>;

    fetchCountByUser(
        userId: string,
        {verificationStats, fromDate}: { verificationStats: string; fromDate?: Date },
    ): Promise<number>;

    fetchByIdologyId(idologyIdNumber): Promise<any>;

    fetchLatestByUser(userId: string): Promise<any>;
}
