import { IDwollaWebhookDAOId, IDwollaWebhookDAO } from '@domain/Core/IDwollaWebhookDAO';
import HoneycombDwollaBeneficialOwner from '@domain/Core/HoneycombDwollaBeneficialOwner/HoneycombDwollaBeneficialOwner';
import { IHoneycombDwollaCustomerRepository } from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import Model from '@infrastructure/Model/';
import HoneycombDwollaCustomer from '@domain/Core/HoneycombDwollaCustomer/HoneycombDwollaCustomer';
import { inject, injectable } from 'inversify';
import DatabaseError from '../Errors/DatabaseError';

const { HoneycombDwollaCustomerModel, HoneycombDwollaBeneficialOwnerModel } = Model;

@injectable()
class HoneycombDwollaCustomerRepository implements IHoneycombDwollaCustomerRepository {
  constructor(@inject(IDwollaWebhookDAOId) private dwollaWebhook: IDwollaWebhookDAO) {}

  async createHoneycombDwollaCustomer(entity: HoneycombDwollaCustomer): Promise<boolean> {
    try {
      await HoneycombDwollaCustomerModel.create(entity);

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByIssuerId(issuerId: string): Promise<HoneycombDwollaCustomer> {
    const honeycombDwollaCustomer = await HoneycombDwollaCustomerModel.findOne({
      where: { issuerId },
    });
    if (!honeycombDwollaCustomer) {
      return null;
    }

    return HoneycombDwollaCustomer.createFromObject(honeycombDwollaCustomer);
  }

  async fetchByDwollaCustomerId(customerId: string): Promise<HoneycombDwollaCustomer> {
    const honeycombDwollaCustomer = await HoneycombDwollaCustomerModel.findOne({
      where: { dwollaCustomerId: customerId },
    });
    if (!honeycombDwollaCustomer) {
      return null;
    }

    return HoneycombDwollaCustomer.createFromObject(honeycombDwollaCustomer);
  }

  async fetchByUserId(userId: string): Promise<HoneycombDwollaCustomer> {
    const honeycombDwollaCustomer = await HoneycombDwollaCustomerModel.findOne({
      where: { userId },
    });
    if (!honeycombDwollaCustomer) {
      return null;
    }

    return HoneycombDwollaCustomer.createFromObject(honeycombDwollaCustomer);
  }

  async fetchByCustomerTypeAndUser(userId: string, customerType: string) {
    const honeycombDwollaCustomer = await HoneycombDwollaCustomerModel.findOne({
      where: { userId, customerType },
    });
    if (!honeycombDwollaCustomer) {
      return null;
    }

    return HoneycombDwollaCustomer.createFromObject(honeycombDwollaCustomer);
  }

  async fetchAllByUserId(userId: string) {
    const honeycombDwollaCustomers = await HoneycombDwollaCustomerModel.findAll({
      where: { userId, deletedAt: null },
      include: [
        {
          model: HoneycombDwollaBeneficialOwnerModel,
        },
      ],
    });
    if (!honeycombDwollaCustomers) {
      return [];
    }

    return Promise.all(
      honeycombDwollaCustomers.map(async (honeycombDwollaCustomerObj) => {
        const honeycombCustomer = HoneycombDwollaCustomer.createFromObject(
          honeycombDwollaCustomerObj,
        );

        if (honeycombDwollaCustomerObj.honeycombDwollaBeneficialOwner) {
          honeycombCustomer.setBusinessBeneficialOwner(
            HoneycombDwollaBeneficialOwner.createFromObject(
              honeycombDwollaCustomerObj.honeycombDwollaBeneficialOwner,
            ),
          );
          const resourceId =
            honeycombCustomer.businessBeneficialOwner.dwollaBeneficialOwnerId;
          const beneficialResponse = await this.dwollaWebhook.fetchByResourceId(
            resourceId,
          );
          if (beneficialResponse !== null) {
            honeycombCustomer.setDwollaBeneficialOwnerStatus(
              beneficialResponse.getStatus(),
            );
          }
        }

        return honeycombCustomer;
      }),
    );
  }

  async updateByIssuer(entity: HoneycombDwollaCustomer): Promise<boolean> {
    try {
      await HoneycombDwollaCustomerModel.update(entity, {
        where: { issuerId: entity.issuerId },
      });

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async updateBusinessCustomerDwollaBalanceId(
    dwollaCustomerId: string,
    dwollaBalanceId: string,
  ): Promise<boolean> {
    try {
      await HoneycombDwollaCustomerModel.update(
        { dwollaBalanceId },
        {
          where: { dwollaCustomerId },
        },
      );

      return true;
    } catch (error) {
      throw new DatabaseError(error.message);
    }
  }

  async fetchByDocumentId(dwollaDocumentId: string) {
    const honeycombDwollaCustomer = await HoneycombDwollaCustomerModel.findOne({
      where: { dwollaDocumentId },
    });
    if (!honeycombDwollaCustomer) {
      return null;
    }

    return HoneycombDwollaCustomer.createFromObject(honeycombDwollaCustomer);
  }
}

export default HoneycombDwollaCustomerRepository;
