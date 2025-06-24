import models from '../Model';
import { IInvitationRepository } from '@domain/Core/Invitation/IInvitationRepository';
import Invitation from '@domain/Core/Invitation/Invitation';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
const { InvitationModel } = models;

@injectable()
class InvitationRepository extends BaseRepository implements IInvitationRepository {
  constructor() {
    super(InvitationModel, 'invitationId', Invitation);
  }

  /**
   * Fetch all invitations from database with pagination
   * @returns {Invitation[]}
   * @param initiator
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchByUser(initiator, paginationOptions, showTrashed) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      whereConditions: { initiator },
    });
  }

  /**
   * Fetch all invitations from database with pagination
   * @returns {Invitation[]}
   * @param paginationOptions
   * @param showTrashed
   */
  async fetchAll({ paginationOptions, showTrashed }) {
    return await super.fetchAll({
      paginationOptions,
      showTrashed,
    });
  }
}

export default InvitationRepository;
