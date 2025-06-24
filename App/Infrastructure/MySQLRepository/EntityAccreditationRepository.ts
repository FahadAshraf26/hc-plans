import models from '../Model';
import BaseRepository from './BaseRepository';
import { injectable } from 'inversify';
import { IEntityAccreditationRepository } from '@domain/Core/EntityAccreditation/IEntityAccreditationRepository';
import EntityAccreditation from '@domain/Core/EntityAccreditation/EntityAccreditation';

@injectable()
class EntityAccreditationRepository extends BaseRepository
  implements IEntityAccreditationRepository {
  constructor() {
    super(models.EntityAccreditationModel, 'entityAccreditationId', EntityAccreditation);
  }
}

export default EntityAccreditationRepository;
