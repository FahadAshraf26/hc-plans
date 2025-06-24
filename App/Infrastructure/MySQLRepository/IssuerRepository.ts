import { IIssuerRepository } from '@domain/Core/Issuer/IIssuerRepository';
import { inject, injectable } from 'inversify';
import models from '../Model';
import Issuer from '@domain/Core/Issuer/Issuer';
import IssuerOwner from '@domain/Core/IssuerOwner/IssuerOwner';
import BaseRepository from './BaseRepository';
import {
  IIssuerOwnerDAO,
  IIssuerOwnerDAOId,
} from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';
import { IDwollaWebhookDAOId, IDwollaWebhookDAO } from '@domain/Core/IDwollaWebhookDAO';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import PaginationData from '@domain/Utils/PaginationData';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import {
  IEmployeeLogRepository,
  IEmployeeLogRepositoryId,
} from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import EmployeeLog from '@domain/Core/EmployeeLog/EmployeeLog';

const {
  IssuerModel,
  OwnerModel,
  UserModel,
  NaicModel,
  CampaignModel,
  HoneycombDwollaBeneficialOwnerModel,
  Sequelize,
} = models;
const { Op } = Sequelize;
@injectable()
class IssuerRepository extends BaseRepository implements IIssuerRepository {
  constructor(
    @inject(IIssuerOwnerDAOId) private issuerOwnerDAO: IIssuerOwnerDAO,
    @inject(IDwollaWebhookDAOId) private dwollaWebhook: IDwollaWebhookDAO,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IDwollaServiceId) private dwollaSerivce: IDwollaService,
    @inject(IEmployeeLogRepositoryId)
    private employeeLogRepository: IEmployeeLogRepository,
  ) {
    super(IssuerModel, 'issuerId', Issuer);
  }
  /**
   *  Store issuer in database
   * @param {Issuer} issuer
   * @returns boolean
   */
  async add(issuer: Issuer) {
    try {
      await super.add(issuer);
      await this._updateIssuerOwnerRef(issuer);
      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async fetchAll({ paginationOptions, options }): Promise<PaginationData<Issuer>> {
    const includes = [
      {
        model: OwnerModel,
        as: 'owners',
      },
      {
        model: NaicModel,
        as: 'naic',
      },
      {
        model: CampaignModel,
        as: 'campaigns',
      },
    ];
    const { showTrashed = false, query } = options;

    const response = await IssuerModel.findAndCountAll({
      include: includes,
      limit: paginationOptions.limit(),
      offset: paginationOptions.offset(),
      paranoid: !showTrashed,
      where: query
        ? {
            [Op.or]: {
              email: { [Op.like]: `%${query}%` },
              issuerName: { [Op.like]: `%${query}%` },
            },
          }
        : {},
      order: [['createdAt', 'DESC']],
    });
    const paginationData: PaginationData<Issuer> = new PaginationData(
      paginationOptions,
      response.count,
    );
    for (const issuer of response.rows) {
      const issuerObj = Issuer.createFromObject(issuer);
      const issuerDwollaCustomer = await this.dwollaCustomerRepository.fetchByIssuerId(
        issuerObj.issuerId,
      );

      let dwollaWebhook;
      let status: string = 'Business Opt-in Required';
      if (issuerDwollaCustomer !== null && issuerDwollaCustomer.getDwollaCustomerId()) {
        dwollaWebhook = await this.dwollaSerivce.getCustomer(
          issuerDwollaCustomer.getDwollaCustomerId(),
        );
      }

      if (!dwollaWebhook) {
        issuerObj.setDwollaStatus(status);
      } else {
        issuerObj.setDwollaStatus(dwollaWebhook.status);
      }

      paginationData.addItem(issuerObj);
    }

    return paginationData;
  }

  /**
   * @param {string} ownerId
   * @param {PaginationOptions} paginationOptions
   * @param {boolean} showTrashed
   * @returns Issuer[]
   */
  async fetchAllByOwner(ownerId, paginationOptions, showTrashed = false) {
    const includes = [
      {
        model: OwnerModel,
        as: 'owners',
        where: { ownerId },
        required: true,
      },
      {
        model: NaicModel,
        as: 'naic',
      },
    ];

    return await super.fetchAll({
      paginationOptions,
      showTrashed,
      includes,
    });
  }

  /**
   * fetchById(issuerId) fetch issuer By Id
   * @param {string} issuerId
   * @returns {Issuer}
   */
  async fetchById(issuerId: string) {
    const includes = [
      {
        model: OwnerModel,
        as: 'owners',
        include: [
          {
            model: UserModel,
            as: 'user',
          },
        ],
      },
      {
        model: NaicModel,
        as: 'naic',
      },
    ];

    return await super.fetchById(issuerId, { includes });
  }

  /**
   * fetchByName(issuerName) fetch issuer By Name
   * @param {string} issuerName
   * @returns {Issuer}
   */
  async fetchByName(issuerName: string) {
    return await super.fetchOneByCustomCritera({
      whereConditions: { issuerName },
    });
  }

  /**
   * update(issuer) fetch issuer by id and then update it
   * @param {Issuer} issuer
   * @returns boolean
   */
  async update(issuer: Issuer) {
    try {
      await this._updateIssuerOwnerRef(issuer);
      delete issuer.owners;
      await super.update(issuer);
      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  /**
   * remove(issuerId) fetch issuer by id and delete it from database
   * @param {Issuer} issuer
   * @returns boolean
   */
  async remove(issuer: Issuer, hardDelete = false) {
    try {
      await super.remove(issuer, hardDelete);
      await this.issuerOwnerDAO.removeByIssuerId(issuer);
      return true;
    } catch (error) {
      throw Error(error);
    }
  }

  async _updateIssuerOwnerRef(issuer: Issuer) {
    await this.issuerOwnerDAO.removeByIssuerId(issuer);
    const createOps = issuer.owners.map((owner) => {
      const issuerOwner = IssuerOwner.createFromDetail(owner.ownerId, issuer.issuerId);

      return this.issuerOwnerDAO.add(issuerOwner);
    });

    await Promise.all(createOps);
  }

  /**
   * fetchIssuerInfoById(issuerId) fetch issuer By Id
   * @param {string} issuerId
   * @returns Issuer
   */
  async fetchIssuerInfoById(issuerId: string) {
    const includes = [
      {
        model: OwnerModel,
        as: 'owners',
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: HoneycombDwollaBeneficialOwnerModel,
            as: 'dwollaBeneficialOwner',
          },
        ],
      },
      {
        model: NaicModel,
        as: 'naic',
      },
      {
        model: CampaignModel,
        as: 'campaigns',
      },
    ];

    const issuerInfoObj = await IssuerModel.findOne({
      where: { issuerId },
      include: includes,
      order: [[{ model: OwnerModel, as: 'owners' }, 'updatedAt', 'ASC']],
    });
    const issuerInfo = Issuer.createFromObject(issuerInfoObj);
    const employeeCountObj = await this.employeeLogRepository.fetchByIssuerId(
      issuerInfo.issuerId,
    );
    if (employeeCountObj) {
      issuerInfo.setEmployeeLog(EmployeeLog.createFomObject(employeeCountObj));
    } else {
      issuerInfo.setEmployeeLog({});
    }
    return issuerInfo;
  }

  /**
   * It will fetch issuer by dwollaCustomerId
   * @param dwollaCustomerId
   * @returns {Promise<Model>}
   */
  async fetchByDwollaCustomerId(dwollaCustomerId: string) {
    return await super.fetchOneByCustomCritera({
      whereConditions: {
        dwollaCustomerId,
      },
    });
  }

  async fetchByEmail(email: string) {
    return await super.fetchOneByCustomCritera({
      whereConditions: {
        email,
      },
    });
  }

  /**
   * It will just update the issuer
   * @param issuer
   * @returns {Promise<boolean>}
   */
  async updateIssuer(issuer: Issuer) {
    try {
      await super.update(issuer);
      return true;
    } catch (error) {
      throw Error(error);
    }
  }
}

export default IssuerRepository;
