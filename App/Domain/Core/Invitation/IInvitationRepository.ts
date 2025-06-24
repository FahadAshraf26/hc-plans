import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import PaginationData from '@domain/Utils/PaginationData';
import Invitation from '@domain/Core/Invitation/Invitation';
import PaginationOptions from '@domain/Utils/PaginationOptions';

export const IInvitationRepositoryId = Symbol.for('IInvitationRepository');
type options = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
};
export interface IInvitationRepository extends IBaseRepository {
  fetchByUser(
    initiator: string,
    paginationOptions: PaginationOptions,
    showTrashed: boolean,
  ): Promise<PaginationData<Invitation>>;
  fetchAll({
    paginationOptions,
    showTrashed,
  }: options): Promise<PaginationData<Invitation>>;
}
