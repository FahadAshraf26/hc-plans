import CampaignEscrowBank from '@domain/Core/CampaignEscrowBank/CampaignEscrowBank';

export const ICampaignEscrowBankServiceId = 'ICampaignEscrowBankService';
export interface ICampaignEscrowBankService {
  addBank(addBankDTO): Promise<boolean>;
  getCampaignEscrowBank(getBankDTO): Promise<CampaignEscrowBank>;
  initiateBankVerification(initiateBankVerificationDTO): Promise<boolean>;
  verifyCampaignEscrowBank(verifyBankDTO): Promise<any>;
}
