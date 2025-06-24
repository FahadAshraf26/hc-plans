import GetUserEventDTO from '@application/UserEvents/GetUserEventDTO';
import UserEvent from '@domain/Core/UserEvent/UserEvent';

export const IUserEventServiceId = Symbol.for('IUserEventService');

export interface IUserEventService {
    get(dto: GetUserEventDTO): Promise<UserEvent>;

    // getAll(dto)
}
