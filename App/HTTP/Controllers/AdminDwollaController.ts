import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import UploadVerificationDocumentDTO from '@application/AdminDwolla/UploadVerificationDocumentDTO';
import { inject, injectable } from 'inversify';
import {
  IAdminDwollaService,
  IAdminDwollaServiceId,
} from '@application/AdminDwolla/IAdminDwollaService';
import UploadOwnerVerificationDocuments from '@application/AdminDwolla/UploadOwnerVerificationDocumentDTO';
import RefundDwollaTransactionBusinessBankDTO from '@application/AdminDwolla/RefundDwollaTransactionBusinessBankDTO';

/**
 * @typedef {import('../Utils/makeExpressCallback').HttpRequest} HttpRequest
 * @typedef {import('../Utils/makeExpressCallback').HttpResponse} HttpResponse
 */

@injectable()
class AdminDwollaController {
  constructor(
    @inject(IAdminDwollaServiceId) private adminDwollaService: IAdminDwollaService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}
  /**
   * @param {HttpRequest} httpRequest
   * @returns {Promise<HttpResponse>}
   */
  uploadVerificationDocument = async (httpRequest) => {
    const { email, documentType } = httpRequest.body;
    const document = httpRequest.file;

    const dto = new UploadVerificationDocumentDTO(email, document, documentType);
    await this.adminDwollaService.uploadVerificationDocument(dto);

    return {
      body: {
        status: 'success',
        message: 'Verification Document Uploaded to Dwolla Successfully!',
      },
    };
  };

  addFundingSource = async (httpRequest) => {
    const res = await this.dwollaService.addFundingSource(
      '8cbf67c5-8b59-4991-8f4f-b4c4ea5ebe35',
      {
        routingNumber: '043000096',
        accountNumber: '1046969356',
        bankAccountType: 'checking',
        name: 'checking account',
      },
    );
    return res;
  };

  getSingleTransaction = async (httpRequest) => {
    const transactionId = httpRequest.body;
    const res = await this.dwollaService.retrieveTransfer(transactionId);

    return {
      body: {
        status: 'success',
        data: res,
      },
    };
  };

  uploadOwnerVerificationDocuments = async (httpRequest) => {
    const { beneficialOwnerId, documentType } = httpRequest.body;
    const document = httpRequest.file;
    const dto = new UploadOwnerVerificationDocuments(
      beneficialOwnerId,
      document,
      documentType,
    );
    await this.adminDwollaService.uploadOwnerVerificationDocument(dto);
    return {
      body: {
        status: 'success',
        message: 'Verification Document Uploaded to Dwolla Successfully!',
      },
    };
  };

  addBeneficialOwner = async (httpRequest) => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      ssn,
      address,
      dwollaCustomerId,
    } = httpRequest.body;

    const input = {
      firstName,
      lastName,
      dateOfBirth,
      ssn,
      address,
    };

    const beneficialOwnerId = await this.dwollaService.createBeneficialOwner(
      dwollaCustomerId,
      input,
    );
    return {
      body: {
        status: 'success',
        message: beneficialOwnerId,
      },
    };
  };

  updateBeneficialOwner = async (httpRequest) => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      ssn,
      address,
      beneficialOwnerId,
    } = httpRequest.body;
    const input = {
      firstName,
      lastName,
      dateOfBirth,
      ssn,
      address,
    };

    await this.dwollaService.updateBeneficialOwner(beneficialOwnerId, input);
    return {
      body: {
        status: 'success',
        message: ' Owner Updated',
      },
    };
  };

  refundDwollaTransactionToBusinessBank = async (httpRequest) => {
    const { amount, dwollaBalanceId, dwollaSourceId } = httpRequest.body;
    const input = new RefundDwollaTransactionBusinessBankDTO(
      dwollaSourceId,
      dwollaBalanceId,
      amount,
    );

    await this.adminDwollaService.refundDwollaTransactionToBusinessBank(input);
    return {
      body: {
        status: 'success',
        message: `${amount} is on its way`,
      },
    };
  };

  deleteDwollaBeneficialOwner = async (httpRequest) => {
    const { dwollaBeneficialOwnerId } = httpRequest.params;
    await this.dwollaService.deleteBeneficialOwner(dwollaBeneficialOwnerId);
    return {
      body: {
        status: 'success',
        data: {},
      },
    };
  };
}

export default AdminDwollaController;
