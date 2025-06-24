import AdminUser from '@domain/Core/AdminUser/AdminUser';
export const IExportInvestorRateOfReturnUseCaseId = Symbol.for(
  'IExportInvestorRateOfReturnUseCase',
);
export interface IExportInvestorRateOfReturnUseCase {
  execute(adminUser: AdminUser): Promise<any>;
}
