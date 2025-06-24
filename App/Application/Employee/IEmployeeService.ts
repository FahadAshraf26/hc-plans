import GetEmployeesDTO from './GetEmployeesDTO';
import UpdateEmployeeDTO from './UpdateEmployeeDTO';
import DeleteEmployeeDTO from './DeleteEmployeeDTO';
import CreateEmployeeDTO from './CreateEmployeeDTO';

export const IEmployeeServiceId = Symbol.for('IEmployeeService');

export interface IEmployeeService {
  getEmployees(getEmployeesDTO: GetEmployeesDTO): Promise<any>;
  findEmployee(findEmployeeDTO: { employeeId: string }): Promise<any>;
  updateEmployee(updateEmployeeDTO: UpdateEmployeeDTO): Promise<boolean>;
  removeEmployee(deleteEmployeeDTO: DeleteEmployeeDTO): Promise<boolean>;
  createEmployee(createEmployeeDTO: CreateEmployeeDTO): Promise<boolean>;
}
