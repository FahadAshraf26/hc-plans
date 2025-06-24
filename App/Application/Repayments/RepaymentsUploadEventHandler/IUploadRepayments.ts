export const IUploadRepaymentsId = Symbol.for('IUploadRepayments');
export interface IUploadRepayments {
  importRepayments(investorRepaymentsObj: any, email: string): Promise<any>;
}
