import { inject, injectable } from 'inversify';
import {
  IHoneycombDwollaCustomerRepositoryId,
  IHoneycombDwollaCustomerRepository,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import { IUserRepositoryId, IUserRepository } from '@domain/Core/User/IUserRepository';
import {
  IEntityIntermediaryRepository,
  IEntityIntermediaryRepositoryId,
} from '@domain/Core/EntityIntermediary/IEntityIntermediayRepository';
import {
  IIssuerRepositoryId,
  IIssuerRepository,
} from '@domain/Core/Issuer/IIssuerRepository';
import {
  ICampaignRepositoryId,
  ICampaignRepository,
} from '@domain/Core/Campaign/ICampaignRepository';
import model from '@infrastructure/Model';

@injectable()
class PreTransactionService {
  constructor(
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IEntityIntermediaryRepositoryId)
    private entityIntermediaryRepository: IEntityIntermediaryRepository,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
  ) {}

  validateCampaign = async (campaignName) => {
    const campaign = await this.campaignRepository.fetchOneByCustomCritera({
      whereConditions: { campaignName },
    });

    if (!campaign || campaign.deletedAt) {
      return null;
    }

    return campaign;
  };

  validateInvestor = async (investorEmail) => {
    const user = await this.userRepository.fetchOneByCustomCritera({
      whereConditions: { email: investorEmail },
      includes: [{ model: model.InvestorModel }],
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return user;
  };

  validateIssuer = async (issuerEmail) => {
    const issuer = await this.issuerRepository.fetchOneByCustomCritera({
      whereConditions: { email: issuerEmail },
    });

    if (!issuer || issuer.deletedAt) {
      return null;
    }

    return issuer;
  };

  validateEntity = async (entityName) => {
    const entity = await this.issuerRepository.fetchOneByCustomCritera({
      whereConditions: { issuerName: entityName },
    });

    if (!entity || entity.deletedAt) {
      return null;
    }

    return entity;
  };

  validateCampaignInvestorFund = async (campaign, investor) => {
    const campaignFund = await this.campaignFundRepository.fetchByInvestorIdAndCampaignId(
      investor.investorId,
      campaign.campaignId,
    );

    if (!campaignFund || campaignFund.DeletedAt()) {
      return null;
    }

    return campaignFund;
  };

  validateCampaignEntityFund = async (campaign, entity) => {
    const campaignFund = await this.campaignFundRepository.fetchByEntityIdAndCampaignId(
      entity.issuerId,
      campaign.campaignId,
    );

    if (!campaignFund || campaignFund.DeletedAt()) {
      return null;
    }

    return campaignFund;
  };

  validateHoneycombDwollaBsuinessCustomer = async (issuer) => {
    const dwollaBusinessCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
      issuer.issuerId,
    );

    if (!dwollaBusinessCustomer || dwollaBusinessCustomer.deletedAt) {
      return null;
    }

    return dwollaBusinessCustomer;
  };

  validateHoneycombDwollaPersonalCustomer = async (user) => {
    const dwollaPersonalCustomer = await this.honeycombDwollaCustomerRepository.fetchByUserId(
      user.userId,
    );
    if (!dwollaPersonalCustomer || dwollaPersonalCustomer.deletedAt) {
      return null;
    }
    return dwollaPersonalCustomer;
  };

  validateIssuerName = async (issuerName) => {
    const issuer = await this.issuerRepository.fetchOneByCustomCritera({
      whereConditions: { issuerName },
    });

    if (!issuer || issuer.deletedAt) {
      return null;
    }

    return issuer;
  };

  validateIssuerCampaigns = async (issuerId) => {
    const campaigns = await this.campaignRepository.fetchAllByIssuerId(issuerId);
    if (campaigns.length === 0) {
      return null;
    }
    return campaigns;
  };
}

export default PreTransactionService;
