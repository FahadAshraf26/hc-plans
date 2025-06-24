import uuid from 'uuid/v4';
import Campaign from '../Campaign/Campaign';
import BaseEntity from '@domain/Core/BaseEntity/BaseEntity';
import { BankVerificationStatus } from '../ValueObjects/BankVerificationStatus';

class CampaignEscrowBank extends BaseEntity {
  private campaignEscrowBankId: string;
  private campaignId: string;
  private routingNumber: number;
  private accountNumber: number;
  private subAccountNumber: number;
  private emailContact: string;
  private status: string;
  dwollaSourceId: string;
  campaign: Campaign;
  bank: any;

  constructor(
    campaignEscrowBankId: string,
    campaignId: string,
    routingNumber: number,
    accountNumber: number,
    subAccountNumber: number,
    emailContact: string,
    status: string,
  ) {
    super();
    this.campaignEscrowBankId = campaignEscrowBankId;
    this.campaignId = campaignId;
    this.routingNumber = routingNumber;
    this.accountNumber = accountNumber;
    this.subAccountNumber = subAccountNumber;
    this.status = status;
    this.emailContact = emailContact;
  }

  setBank(dwollaSourceId) {
    this.dwollaSourceId = dwollaSourceId;
  }

  setCampaign(campaign) {
    this.campaign = campaign;
  }

  /**
   * Create CampaignEscrow bank Object
   * @param {object} campaignEscrowBankObj
   * @returns CampaignEscrow bank
   */
  static createFromObject(campaignEscrowBankObj): CampaignEscrowBank {
    const campaignEscrowBank = new CampaignEscrowBank(
      campaignEscrowBankObj.campaignEscrowBankId,
      campaignEscrowBankObj.campaignId,
      campaignEscrowBankObj.routingNumber,
      campaignEscrowBankObj.accountNumber,
      campaignEscrowBankObj.subAccountNumber,
      campaignEscrowBankObj.emailContact,
      campaignEscrowBankObj.status,
    );

    if (campaignEscrowBankObj.dwollaSourceId) {
      campaignEscrowBank.setBank(campaignEscrowBankObj.dwollaSourceId);
    }

    if (campaignEscrowBankObj.campaign) {
      campaignEscrowBank.setCampaign(
        Campaign.createFromObject(campaignEscrowBankObj.campaign),
      );
    }

    if (campaignEscrowBankObj.createdAt) {
      campaignEscrowBank.setCreatedAt(campaignEscrowBankObj.createdAt);
    }

    if (campaignEscrowBankObj.updatedAt) {
      campaignEscrowBank.setUpdatedAt(campaignEscrowBankObj.updatedAt);
    }

    if (campaignEscrowBankObj.deletedAt) {
      campaignEscrowBank.setDeletedAT(campaignEscrowBankObj.deletedAt);
    }

    return campaignEscrowBank;
  }

  /**
   * Create CampaignEscrow Bank Object with Id
   * @param {string} bankToken
   * @param {string} accountOwner - where account belongs to campaignEscrow or escrow
   */
  static createFromDetail(
    campaignId: string,
    routingNumber: number,
    accountNumber: number,
    subAccountNumber: number,
    emailContact: string,
    status: string = BankVerificationStatus.PENDING,
  ): CampaignEscrowBank {
    return new CampaignEscrowBank(
      uuid(),
      campaignId,
      routingNumber,
      accountNumber,
      subAccountNumber,
      emailContact,
      status,
    );
  }
}
export default CampaignEscrowBank;
