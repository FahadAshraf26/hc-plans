import DatabaseError from '../Errors/DatabaseError';
import PaginationData from '../../Domain/Utils/PaginationData';
import { injectable, unmanaged } from 'inversify';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';
import 'reflect-metadata';

const VALUE_NOT_SET = 'UNDEFINED';
@injectable()
class BaseRepository implements IBaseRepository {
  private model: any = VALUE_NOT_SET;
  private entityId: string = VALUE_NOT_SET;
  private entity: any = VALUE_NOT_SET;

  constructor(@unmanaged() model, @unmanaged() entityId, @unmanaged() entity) {
    this.model = model;
    this.entityId = entityId;
    this.entity = entity;
  }

  /**
   * adds a record of type {model}
   * @param {object} entityObj -  takes {entity} as input
   * @returns {Boolean | Object} returns boolean or entity
   */
  async add(entityObj) {
    try {
      await this.model.create(entityObj);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * adds multiple records of type {_model}
   * @param {object[]} entityObj -  takes {_entity}[] as input
   * @returns {Boolean} returns boolean
   */
  async addBulk(entityObj) {
    try {
      await this.model.bulkCreate(entityObj);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * fetches model record by {_entityId}
   * @param {string} entityId -  id of entity to fetch
   * @param {{includes: array[Object],showTrashed: boolean,raw:boolean}} options - fetchOptions
   * @returns {Object | Boolean} - returns record if found or false
   */
  async fetchById(entityId, options = {}) {
    try {
      const { includes = [], showTrashed = 'false', raw = false, ...rest }: any = options;

      const entityRecord = await this.model.findOne({
        where: { [this.entityId]: entityId },
        include: includes,
        paranoid: !showTrashed,
        ...rest,
      });

      if (!entityRecord) {
        return false;
      }

      if (raw) {
        return entityRecord;
      }

      return this.entity.createFromObject(entityRecord);
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * fetches model record aginat given criteria
   * @param {{includes: array[Object],showTrashed: boolean,whereConditions: object,raw:boolean}} options - fetchOptions
   * @returns {Object | Boolean} - returns record if found or false
   */
  async fetchOneByCustomCritera(options = {}) {
    try {
      const {
        includes = [],
        showTrashed = false,
        raw = false,
        whereConditions = {},
        ...rest
      }: any = options;

      const entityRecord = await this.model.findOne({
        where: whereConditions,
        include: includes,
        paranoid: !showTrashed,
        ...rest,
      });

      if (!entityRecord) {
        return false;
      }

      if (raw) {
        return entityRecord;
      }

      return this.entity.createFromObject(entityRecord);
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * fetches paginated records of {_model} against given criteria
   * @param {{populateModel?: boolean,whereConditions: object,paginationOptions: PaginationOptions,showTrashed:boolean,includes: object[],raw:boolean}} param0
   * @returns {PaginationData} - returns instance of {PaginationData}
   */
  async fetchAll(options = {}) {
    try {
      const {
        whereConditions = {},
        paginationOptions,
        showTrashed = false,
        includes = [],
        raw = false,
        populateModel = true,
        ...rest
      }: any = options;

      const response = await this.model.findAndCountAll({
        where: whereConditions,
        limit: paginationOptions.limit(),
        offset: paginationOptions.offset(),
        include: includes,
        paranoid: !showTrashed,
        raw: !populateModel,
        ...rest,
      });

      if (raw) {
        return response;
      }

      const paginationData = new PaginationData(paginationOptions, response.count);
      response.rows.forEach((entityObj) =>
        paginationData.addItem(this.entity.createFromObject(entityObj)),
      );

      return paginationData;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * takes entity object and updates values
   * @param {object} entityObj
   * @returns {boolean}
   */
  async update(entityObj, whereConditions: {} | null = null) {
    try {
      if (!whereConditions) {
        whereConditions = { [this.entityId]: entityObj[this.entityId] };
      }

      await this.model.update(entityObj, {
        where: whereConditions,
        individualHooks: true,
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  /**
   * takes entity object and deletes it
   * @param {object} entityObj
   * @param {boolean} hardDelete
   */
  async remove(entityObj, hardDelete = false) {
    try {
      await this.model.destroy({
        entityObj,
        where: { [this.entityId]: entityObj[this.entityId] },
        force: hardDelete,
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async restore(entityObj) {
    try {
      await this.model.restore({
        where: { [this.entityId]: entityObj[this.entityId] },
      });
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }
}

export default BaseRepository;
