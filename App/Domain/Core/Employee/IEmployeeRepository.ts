import Employee from './Employee';

export const IEmployeeRepositoryId = Symbol.for('IEmployeeRepository');

export interface IEmployeeRepository {
  add(employeeEntity: Employee): Promise<boolean>;
  fetchById(employeeId: string);
  fetchAll(issuerId: string, paginationOptions, options);
  update(employeeEntity: Employee): Promise<boolean>;
  remove(employeeId: string, hardDelete: boolean): Promise<boolean>;
}
