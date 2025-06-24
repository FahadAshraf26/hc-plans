import AdminUser from '@domain/Core/AdminUser/AdminUser';
export const IRepaymentExportDataUseCaseId = Symbol.for('IRepaymentExportDataUseCase');
export interface IRepaymentExportDataUseCase{
  execute(adminUser: AdminUser): Promise<any>;
}