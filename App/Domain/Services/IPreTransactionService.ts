import Campaign from '@domain/Core/Campaign/Campaign';
import Issuer from '@domain/Core/Issuer/Issuer';
import User from '@domain/Core/User/User';
import Entity from '@domain/Core/EntityIntermediary/EntityIntermediary';

export const IPreTransactionServiceId = Symbol.for('IPreTransactionService');
export interface IPreTransactionService {
  validateCampaign(campaignName: string): Promise<Campaign>;
  validateInvestor(investorEmail: string): Promise<User>;
  validateIssuer(issuerEmail: string): Promise<Issuer>;
  validateEntity(entityName: string): Promise<Entity>;
  validateCampaignInvestorFund(campaign: any, investor: any): Promise<any>;
  validateHoneycombDwollaBsuinessCustomer(issuer: any): Promise<any>;
  validateHoneycombDwollaPersonalCustomer(user: any): Promise<any>;
  validateIssuerName(issuerName: string): Promise<any>;
  validateIssuerCampaigns(issuerId: string): Promise<any>;
  validateCampaignEntityFund(campaign: any, entity: any): Promise<any>;
}
