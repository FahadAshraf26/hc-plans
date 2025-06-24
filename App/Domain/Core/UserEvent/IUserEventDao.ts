import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import UserEvent from '@domain/Core/UserEvent/UserEvent';
import {IBaseRepository} from '@domain/Core/BaseEntity/IBaseRepository';

export const IUserEventDaoId = Symbol.for('IUserEventDao');
type userEventOptions = {
    showTrashed?: string | boolean;
};

type userEventByIdOptions = {
    showTrashed?: string | boolean;
    type?: string;
};

export interface IUserEventDao extends IBaseRepository {
    fetchAllUserEvents(
        paginationOptions: PaginationOptions,
        options: userEventOptions,
    ): Promise<PaginationData<UserEvent>>;

    fetchAllByUserId(
        userId: string,
        paginationOptions: PaginationOptions,
        options?: userEventByIdOptions,
    ): Promise<PaginationData<UserEvent>>;

    fetchLatestByType(eventType: string, options?: any): Promise<UserEvent>;
}
