import AdminUser from '@domain/Core/AdminUser/AdminUser';
export const IExportInvestorProjectionReturnsUseCaseId = Symbol.for(
  'IExportInvestorProjectionReturnsUseCase',
);
export interface IExportInvestorProjectionReturnsUseCase {
  execute(adminUser: AdminUser): Promise<any>;
}
