import EntityIntermediary from '@domain/Core/EntityIntermediary/EntityIntermediary';
import { IEntityIntermediaryRepository } from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';

import { injectable } from 'inversify';

import models from '../Model';

import BaseRepository from './BaseRepository';

@injectable()
class EntityIntermediaryRepository extends BaseRepository
  implements IEntityIntermediaryRepository {
  constructor() {
    super(models.EntityIntermediaryModel, 'entityIntermediaryId', EntityIntermediary);
  }

  async fetchEntitesByUserId(userId: string) {
    return models.EntityIntermediaryModel.findAll({
      where: { userId },
      attributes: [
        'entityIntermediaryId',
        'operatorAgreementApproved',
        'intermediaryName',
      ],
      include: [
        {
          model: models.IssuerModel,
        },
      ],
    });
  }

  async upsert(values, condition) {
    return models.EntityIntermediaryModel.findOne({ where: condition }).then(function (
      obj,
    ) {
      if (obj)
        return obj.update({
          intermediaryName: values.intermediaryName,
          operatorAgreementApproved: values.operatorAgreementApproved,
          issuerId: values.issuerId,
        });
      return models.EntityIntermediaryModel.create(values);
    });
  }

  async fetchByIntermediaryName(intermediaryName) {
    return models.EntityIntermediaryModel.findOne({
      where: {
        intermediaryName,
      },
    });
  }

  async fetchByIssuerId(issuerId: string) {
    return models.EntityIntermediaryModel.findOne({
      where: {
        issuerId,
      },
    });
  }
}

export default EntityIntermediaryRepository;
