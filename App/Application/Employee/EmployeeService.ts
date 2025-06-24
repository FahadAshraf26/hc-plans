import Employee from '../../Domain/Core/Employee/Employee';
import EmployeeMap from '../../Domain/Core/Employee/EmployeeMap';
import HttpException from '../../Infrastructure/Errors/HttpException';
import GetEmployeesDTO from './GetEmployeesDTO';
import UpdateEmployeeDTO from './UpdateEmployeeDTO';
import DeleteEmployeeDTO from './DeleteEmployeeDTO';
import CreateEmployeeDTO from './CreateEmployeeDTO';
import { IEmployeeService } from './IEmployeeService';
import { inject, injectable } from 'inversify';
import {
  IEmployeeRepository,
  IEmployeeRepositoryId,
} from '@domain/Core/Employee/IEmployeeRepository';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';

@injectable()
class EmployeeService implements IEmployeeService {
  constructor(
    @inject(IEmployeeRepositoryId) private employeeRepository: IEmployeeRepository,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
  ) {}

  async getEmployees(getEmployeesDTO: GetEmployeesDTO) {
    const result = await this.employeeRepository.fetchAll(
      getEmployeesDTO.getIssuerId(),
      getEmployeesDTO.getPaginationOptions(),
      {
        showTrashed: getEmployeesDTO.isShowTrashed(),
        query: getEmployeesDTO.getQuery(),
      },
    );

    result.items = result.items.map((employee) => {
      return EmployeeMap.toDTO(employee);
    });

    return result.getPaginatedData();
  }

  async findEmployee(findEmployeeDTO: { employeeId: string }) {
    const employee = await this.employeeRepository.fetchById(findEmployeeDTO.employeeId);

    if (!employee) {
      throw new HttpException(404, 'no employee record found against the provided input');
    }

    return EmployeeMap.toDTO(employee);
  }

  async updateEmployee(updateEmployeeDTO: UpdateEmployeeDTO) {
    const employee = await this.employeeRepository.fetchById(
      updateEmployeeDTO.getEmployeeId(),
    );

    if (!employee) {
      throw new HttpException(404, 'no employee record found against the provided input');
    }

    const employeeEntity = Employee.create(
      updateEmployeeDTO,
      updateEmployeeDTO.getEmployeeId()!,
    );

    const updateEmployee = await this.employeeRepository.update(employeeEntity);

    if (!updateEmployee) {
      throw new HttpException(400, 'employee document update failed');
    }

    return updateEmployee;
  }

  async removeEmployee(deleteEmployeeDTO: DeleteEmployeeDTO) {
    const employee = await this.employeeRepository.fetchById(
      deleteEmployeeDTO.getEmployeeId(),
    );

    if (!employee) {
      throw new HttpException(404, 'no employee record found against the provided input');
    }

    const deleteResult = await this.employeeRepository.remove(
      deleteEmployeeDTO.getEmployeeId(),
      deleteEmployeeDTO.shouldHardDelete(),
    );

    if (!deleteResult) {
      throw new HttpException(400, 'employee delete failed');
    }

    return deleteResult;
  }

  async createEmployee(createEmployeeDTO: CreateEmployeeDTO) {
    const issuer = await this.issuerRepository.fetchById(createEmployeeDTO.getIssuerId());

    if (!issuer) {
      throw new HttpException(400, 'cannot add an employee');
    }

    const createResult = await this.employeeRepository.add(
      createEmployeeDTO.getEmployee(),
    );

    if (!createResult) {
      throw new HttpException(400, 'employee create failed');
    }

    return createResult;
  }
}

export default EmployeeService;
