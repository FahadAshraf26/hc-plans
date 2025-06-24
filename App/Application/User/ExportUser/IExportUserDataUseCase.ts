import AdminUser from '@domain/Core/AdminUser/AdminUser';

export const IExportUserDataUseCaseId = Symbol.for('IExportUserDataUseCase');
export interface IExportUserDataUseCase {
  execute(adminUser: AdminUser): Promise<any>;
}
