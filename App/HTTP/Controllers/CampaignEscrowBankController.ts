import CampaignEscrowBankService from '@application/CampaignEscrowBank/CampaignEscrowBankService';
import AddBankDTO from '@application/CampaignEscrowBank/AddBankDTO';
import GetBankDTO from '@application/CampaignEscrowBank/GetBankDTO';
import VerifyBankDTO from '@application/CampaignEscrowBank/VerifyBankDTO';
import InitiateBankVerificationDTO from '@application/CampaignEscrowBank/InitiateBankVerificationDTO';
import { inject, injectable } from 'inversify';
import {
  ICampaignEscrowBankService,
  ICampaignEscrowBankServiceId,
} from '@application/CampaignEscrowBank/ICampaignEscrowBankService';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class CampaignEscrowBankController {
  constructor(
    @inject(ICampaignEscrowBankServiceId)
    private campaignEscrowBankService: ICampaignEscrowBankService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  addBank = async (httpRequest) => {
    const { campaignId } = httpRequest.params;
    const {
      routingNumber,
      accountNumber,
      subAccountNumber,
      emailContact,
    } = httpRequest.body;

    const input = new AddBankDTO(
      campaignId,
      routingNumber,
      accountNumber,
      subAccountNumber,
      emailContact,
    );
    await this.campaignEscrowBankService.addBank(input);

    return {
      body: {
        status: 'success',
        message: 'campaign bank added successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  getBank = async (httpRequest) => {
    const { campaignId } = httpRequest.params;

    const input = new GetBankDTO(campaignId);
    const bank = await this.campaignEscrowBankService.getCampaignEscrowBank(input);

    return {
      body: {
        status: 'success',
        data: bank,
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  verifyBank = async (httpRequest) => {
    const { campaignId, campaignEscrowBankId } = httpRequest.params;
    const { firstTransactionAmount, secondTransactionAmount } = httpRequest.body;

    const input = new VerifyBankDTO(
      campaignId,
      campaignEscrowBankId,
      firstTransactionAmount,
      secondTransactionAmount,
    );

    await this.campaignEscrowBankService.verifyCampaignEscrowBank(input);

    return {
      body: {
        status: 'success',
        message: 'campaign bank verified successfully',
      },
    };
  };

  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  initiateBankVerification = async (httpRequest) => {
    const { campaignId, campaignEscrowBankId } = httpRequest.params;

    const input = new InitiateBankVerificationDTO(campaignId, campaignEscrowBankId);
    await this.campaignEscrowBankService.initiateBankVerification(input);

    return {
      body: {
        status: 'success',
        message: 'campaign bank verification initiated successfully',
      },
    };
  };
}

export default CampaignEscrowBankController;
