import CreateInvitationDTO from '@application/Invitation/CreateInvitationDTO';
import GetInvitationDTO from '@application/Invitation/GetInvitationDTO';
import Invitation from '@domain/Core/Invitation/Invitation';
import FindInvitationDTO from '@application/Invitation/FindInvitationDTO';
import UpdateInvitationDTO from '@application/Invitation/UpdateInvitationDTO';
import RemoveInvitationDTO from '@application/Invitation/RemoveInvitationDTO';

export const IInvitationServiceId = Symbol.for('IInvitationService');
type response = {
  status: string;
  paginationInfo;
  data: Array<Invitation>;
};
export interface IInvitationService {
  createInvitation(createInvitationDTO: CreateInvitationDTO): Promise<boolean>;
  getInvitations(getInvitationDTO: GetInvitationDTO): Promise<response>;
  findInvitation(findInvitationDTO: FindInvitationDTO): Promise<Invitation>;
  updateInvitation(updateInvitationDTO: UpdateInvitationDTO): Promise<boolean>;
  removeInvitation(removeInvitationDTO: RemoveInvitationDTO): Promise<boolean>;
}
