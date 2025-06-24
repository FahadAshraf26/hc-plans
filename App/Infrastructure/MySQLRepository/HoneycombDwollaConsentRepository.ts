import { IHoneycombDwollaConsentRepository } from '@domain/Core/HoneycombDwollaConsent/IHoneycombDwollaConsentRepository';
import Model from '@infrastructure/Model/';
import HoneycombDwollaConsent from '@domain/Core/HoneycombDwollaConsent/HoneycombDwollaConsent';
import { injectable } from 'inversify';
import DatabaseError from '../Errors/DatabaseError';

const { HoneycombDwollaConsentModel } = Model;
@injectable()
class HoneycombDwollaConsentRepository implements IHoneycombDwollaConsentRepository {
  constructor() {}

  async createHoneycombDwollaConsent(entity: HoneycombDwollaConsent): Promise<boolean> {
    try {
      await HoneycombDwollaConsentModel.create(entity);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByIssuerId(issuerId: string): Promise<HoneycombDwollaConsent> {
    const honeycombDwollaConsent = await HoneycombDwollaConsentModel.findOne({
      where: { issuerId },
    });

    if (!honeycombDwollaConsent) {
      return null;
    }
    const honeycombDwollaConsentEntity = HoneycombDwollaConsent.createFromObject(
      honeycombDwollaConsent,
    );

    return honeycombDwollaConsentEntity;
  }
}

export default HoneycombDwollaConsentRepository;
