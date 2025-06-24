import { inject, injectable } from 'inversify';
import CreateInvitationDTO from '@application/Invitation/CreateInvitationDTO';
import GetInvitationDTO from '@application/Invitation/GetInvitationDTO';
import FindInvitationDTO from '@application/Invitation/FindInvitationDTO';
import UpdateInvitationDTO from '@application/Invitation/UpdateInvitationDTO';
import RemoveInvitationDTO from '@application/Invitation/RemoveInvitationDTO';
import {
  IInvitationService,
  IInvitationServiceId,
} from '@application/Invitation/IInvitationService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */
@injectable()
class InvitationController {
  constructor(
    @inject(IInvitationServiceId) private invitationService: IInvitationService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  createInvitation = async (httpRequest) => {
    const { initiator } = httpRequest.params;
    const { invitee } = httpRequest.body;

    const createInvitationDTO = new CreateInvitationDTO(initiator, invitee);
    await this.invitationService.createInvitation(createInvitationDTO);

    return { body: { status: 'success', message: 'Invitation Created Successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getInvitations = async (httpRequest) => {
    const { initiator } = httpRequest.params;
    const { page, perPage, showTrashed } = httpRequest.query;

    const getInvitationDTO = new GetInvitationDTO(initiator, page, perPage, showTrashed);
    const invitation = await this.invitationService.getInvitations(getInvitationDTO);

    return { body: invitation };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  findInvitation = async (httpRequest) => {
    const { invitationId } = httpRequest.params;

    const findInvitationDTO = new FindInvitationDTO(invitationId);
    const invitation = await this.invitationService.findInvitation(findInvitationDTO);

    return {
      body: {
        status: 'success',
        data: invitation,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  updateInvitation = async (httpRequest) => {
    const { initiatorId, invitationId } = httpRequest.params;
    const { body } = httpRequest;

    const updateInvitationDTO = new UpdateInvitationDTO({
      initiatorId,
      invitationId,
      ...body,
    });

    await this.invitationService.updateInvitation(updateInvitationDTO);

    return { body: { status: 'success', message: 'Invitation Updated Successfully' } };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  removeInvitation = async (httpRequest) => {
    const { invitationId } = httpRequest.params;
    const { hardDelete } = httpRequest.query;

    const removeInvitationDTO = new RemoveInvitationDTO(invitationId, hardDelete);
    await this.invitationService.removeInvitation(removeInvitationDTO);

    return { body: { status: 'success', message: 'Invitation Deleted Successfully' } };
  };
}
export default InvitationController;
