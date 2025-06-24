import HoneycombDwollaBeneficialOwner from '@domain/Core/HoneycombDwollaBeneficialOwner/HoneycombDwollaBeneficialOwner';
import { IHoneycombDwollaBeneficialOwnerRepository } from '@domain/Core/HoneycombDwollaBeneficialOwner/IHoneycombDwollaBeneficialOwnerRepository';
import { injectable } from 'inversify';
import DatabaseError from '../Errors/DatabaseError';
import Model from '@infrastructure/Model/';

const { HoneycombDwollaBeneficialOwnerModel } = Model;
@injectable()
class HoneycombDwollaBeneficialOwnerRepository
  implements IHoneycombDwollaBeneficialOwnerRepository {
  async createDwollaBeneficialOwner(entity): Promise<boolean> {
    try {
      await HoneycombDwollaBeneficialOwnerModel.create(entity);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByDwollaCustomerId(dwollaCustomerId: string) {
    try {
      const dwollaBeneficialOwner = await HoneycombDwollaBeneficialOwnerModel.findOne({
        where: { dwollaCustomerId },
      });
      if (!dwollaBeneficialOwner) {
        return null;
      }

      return HoneycombDwollaBeneficialOwner.createFromObject(dwollaBeneficialOwner);
    } catch (err) {}
  }
}

export default HoneycombDwollaBeneficialOwnerRepository;
