import { ICampaignEscrowBankService } from '@application/CampaignEscrowBank/ICampaignEscrowBankService';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import {
  ICampaignEscrowBankRepository,
  ICampaignEscrowBankRepositoryId,
} from '@domain/Core/CampaignEscrowBank/ICampaignEscrowBankRepository';
import { BankVerificationStatus } from '@domain/Core/ValueObjects/BankVerificationStatus';
import HttpException from '@infrastructure/Errors/HttpException';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';

@injectable()
class CampaignEscrowBankService implements ICampaignEscrowBankService {
  constructor(
    @inject(ICampaignEscrowBankRepositoryId)
    private campaignEscrowRepository: ICampaignEscrowBankRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}
  async addBank(addBankDTO) {
    const campaignEscrowBank = addBankDTO.getCampaignEscrowBank();

    const campaign = await this.campaignRepository.fetchById(
      campaignEscrowBank.campaignId,
    );

    if (!campaign) {
      throw new HttpException(404, 'no campaign found against the provided input');
    }

    const {
      issuer: { dwollaCustomerId },
      campaignName,
    } = campaign;

    if (!dwollaCustomerId) {
      throw new HttpException(400, 'invalid data, missing dwolla customer details');
    }

    const fundingSourceId = await this.dwollaService.addFundingSource(dwollaCustomerId, {
      name: `${campaignName}'s escrow account`,
      routingNumber: campaignEscrowBank.routingNumber,
      accountNumber: campaignEscrowBank.accountNumber,
      bankAccountType: 'checking',
    });

    campaignEscrowBank.setBank(fundingSourceId);

    const addResult = await this.campaignEscrowRepository.add(campaignEscrowBank);

    if (!addResult) {
      throw new HttpException(400, 'Add Bank Account to Issuer Failed');
    }

    // initiate verification
    await this.dwollaService.makeMicroDeposits(fundingSourceId);

    return addResult;
  }

  async getCampaignEscrowBank(getBankDTO) {
    const campaign = await this.campaignRepository.fetchById(getBankDTO.getCampaignId());

    if (!campaign) {
      throw new HttpException(404, 'no campaign found against the provided input');
    }

    const campaignEscrowBank = await this.campaignEscrowRepository.fetchByCampaignId(
      getBankDTO.getCampaignId(),
    );

    if (!campaignEscrowBank) {
      throw new HttpException(400, 'no escrow account attached to campaign');
    }

    if (campaignEscrowBank.dwollaSourceId) {
      campaignEscrowBank.bank = await this.dwollaService.retrieveFundingSource(
        campaignEscrowBank.dwollaSourceId,
      );
    }

    return campaignEscrowBank;
  }

  async initiateBankVerification(initiateBankVerificationDTO) {
    const campaign = await this.campaignRepository.fetchById(
      initiateBankVerificationDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(404, 'no campaign found against the provided input');
    }

    const campaignEscrowBank = await this.campaignEscrowRepository.fetchById(
      initiateBankVerificationDTO.getCampaignEscrowBankId(),
    );

    if (!campaignEscrowBank) {
      throw new HttpException(400, 'no such escrow bank account found');
    }

    await this.dwollaService.makeMicroDeposits(campaignEscrowBank.dwollaSourceId);

    return true;
  }

  async verifyCampaignEscrowBank(verifyBankDTO) {
    const campaign = await this.campaignRepository.fetchById(
      verifyBankDTO.getCampaignId(),
    );

    if (!campaign) {
      throw new HttpException(404, 'no campaign found against the provided input');
    }

    const campaignEscrowBank = await this.campaignEscrowRepository.fetchById(
      verifyBankDTO.getCampaignEscrowBankId(),
    );

    if (!campaignEscrowBank) {
      throw new HttpException(400, 'no such escrow bank account found');
    }

    const verifyResult = await this.dwollaService.verifyFundingSource({
      fundingSourceId: campaignEscrowBank.dwollaSourceId,
      firstTransactionAmount: verifyBankDTO.getFirstTransactionAmount(),
      secondTransactionAmount: verifyBankDTO.getSecondTransactionDTO(),
    });

    campaignEscrowBank.status = verifyResult
      ? BankVerificationStatus.SUCCESS
      : BankVerificationStatus.FAILED;

    await this.campaignEscrowRepository.update(campaignEscrowBank);

    return verifyResult;
  }
}

export default CampaignEscrowBankService;
