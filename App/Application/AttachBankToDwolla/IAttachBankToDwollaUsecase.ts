export const IAttachBankToDwollaUsecaseId = Symbol.for('IAttachBankToDwollaUsecase');
export interface IAttachBankToDwollaUsecase {
  execute(userId: string): Promise<any>;
}
