import uuid from 'uuid/v4';
import { IAdminDwollaService } from '@application/AdminDwolla/IAdminDwollaService';
import {
  IHoneycombDwollaCustomerRepository,
  IHoneycombDwollaCustomerRepositoryId,
} from '@domain/Core/HoneycombDwollaCustomer/IHoneycombDwollaCustomerRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import HttpException from '@infrastructure/Errors/HttpException';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import { inject, injectable } from 'inversify';
import UploadVerificationDocumentDTO from './UploadVerificationDocumentDTO';
import UploadOwnerVerificationDocuments from './UploadOwnerVerificationDocumentDTO';
import RefundDwollaTransactionBusinessBankDTO from './RefundDwollaTransactionBusinessBankDTO';

@injectable()
class AdminDwollaService implements IAdminDwollaService {
  constructor(
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private honeycombDwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IHoneycombDwollaCustomerRepositoryId)
    private dwollaCustomerRepository: IHoneycombDwollaCustomerRepository,
  ) {}
  /**
   *
   * @param {UploadVerificationDocumentDTO} dto
   */
  async uploadVerificationDocument(dto: UploadVerificationDocumentDTO) {
    const email = dto.getEmail();

    const issuer = await this.issuerRepository.fetchByEmail(email);
    if (issuer) {
      const dwollaCustomer = await this.dwollaCustomerRepository.fetchByIssuerId(
        issuer.issuerId,
      );

      if (dwollaCustomer) {
        if (!dwollaCustomer || !dwollaCustomer.getDwollaCustomerId()) {
          throw new HttpException(400, 'are you sure that email is correct?');
        }

        const dwollaDocumentId = await this.dwollaService.createCustomerDocument({
          customerId: dwollaCustomer.getDwollaCustomerId(),
          documentType: dto.getDocumentType(),
          file: dto.getDocument(),
        });

        if (dwollaDocumentId) {
          const issuer = await this.issuerRepository.fetchOneByCustomCritera({
            whereConditions: { email },
          });

          if (issuer) {
            const dwollaCustomer = await this.honeycombDwollaCustomerRepository.fetchByIssuerId(
              issuer.issuerId,
            );

            if (dwollaCustomer) {
              dwollaCustomer.setDwollaDocumentId(dwollaDocumentId);
              await this.honeycombDwollaCustomerRepository.updateByIssuer(dwollaCustomer);
            }
          }
        }

        return true;
      }
    }
  }

  async uploadOwnerVerificationDocument(dto: UploadOwnerVerificationDocuments) {
    await this.dwollaService.createBeneficialOwnerDocuments({
      beneficialOwnerId: dto.getBeneficialOwnerId(),
      file: dto.getDocument(),
      documentType: dto.getDocumentType(),
    });
    return true;
  }

  async refundDwollaTransactionToBusinessBank(
    refundDwollaTransactionBusinessBankDTO: RefundDwollaTransactionBusinessBankDTO,
  ) {
    let idempotencyKey = uuid();
    const dwollaBalanceId = refundDwollaTransactionBusinessBankDTO.getDwollaBalanceId();
    const dwollaSourceId = refundDwollaTransactionBusinessBankDTO.getDwollaSourceId();
    const amount = refundDwollaTransactionBusinessBankDTO.getAmount();
    const fee = await this.dwollaService.createFee(amount, dwollaSourceId);
    
    return await this.dwollaService.createTransfer({
      sourceId: dwollaBalanceId,
      destinationId: dwollaSourceId,
      amount,
      fee,
      sameDayACH: false,
      idempotencyKey,
    });
  }
}

export default AdminDwollaService;
