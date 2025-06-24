import UploadVerificationDocumentDTO from '@application/AdminDwolla/UploadVerificationDocumentDTO';
import UploadOwnerVerificationDocuments from './UploadOwnerVerificationDocumentDTO';
import RefundDwollaTransactionBusinessBankDTO from './RefundDwollaTransactionBusinessBankDTO';

export const IAdminDwollaServiceId = Symbol.for('IAdminDwollaService');
export interface IAdminDwollaService {
  uploadVerificationDocument(dto: UploadVerificationDocumentDTO): Promise<boolean>;
  uploadOwnerVerificationDocument(dto: UploadOwnerVerificationDocuments): Promise<boolean>;
  refundDwollaTransactionToBusinessBank(refundDwollaTransactionBusinessBankDTO: RefundDwollaTransactionBusinessBankDTO);
}
