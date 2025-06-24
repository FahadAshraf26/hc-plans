import models from '../Model';
import IssuerOwner from '@domain/Core/IssuerOwner/IssuerOwner';
import { IIssuerOwnerDAO } from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';
import BaseRepository from './BaseRepository';
const { IssuerOwnerModel } = models;

class IssuerOwnerDAO extends BaseRepository implements IIssuerOwnerDAO {
  constructor() {
    super(IssuerOwnerModel, 'issuerOwnerId', IssuerOwner);
  }
  /**
   * Fetch Owner BY ownerId
   * @param {string} ownerId
   * @returns IssuerOwner
   */
  async fetchByOwnerId(ownerId) {
    return super.fetchOneByCustomCritera({
      whereConditions: {
        ownerId,
      },
    });
  }
  /**
   *
   * @param {IssuerOwner} issuerOwner
   */
  async upsert(issuerOwner) {
    try {
      const issuerOwnerObj = await super.fetchById(issuerOwner.issuerOwnerId);

      if (issuerOwnerObj) {
        return await super.update(issuerOwner);
      }

      return await super.add(issuerOwner);
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   *
   * @param {Issuer} issuer
   * @param {Owner} owner
   */
  async removeByIssuerOwner(issuer, owner, hardDelete = false) {
    try {
      await IssuerOwnerModel.destroy({
        where: { issuerId: issuer.issuerId, ownerId: owner.ownerId },
        force: hardDelete,
      });

      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * Delete IssuerOwner By IssueId
   */
  async removeByIssuerId(issuer) {
    try {
      await IssuerOwnerModel.destroy({
        where: { issuerId: issuer.issuerId },
        force: true,
      });
      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default IssuerOwnerDAO;
