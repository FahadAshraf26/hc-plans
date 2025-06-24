import CreateEmployeeDTO from '../../Application/Employee/CreateEmployeeDTO';
import UpdateEmployeeDTO from '../../Application/Employee/UpdateEmployeeDTO';
import DeleteEmployeeDTO from '../../Application/Employee/DeleteEmployeeDTO';
import GetEmployeesDTO from '../../Application/Employee/GetEmployeesDTO';
import { inject, injectable } from 'inversify';
import {
  IEmployeeService,
  IEmployeeServiceId,
} from '@application/Employee/IEmployeeService';

@injectable()
class EmployeeController {
  constructor(@inject(IEmployeeServiceId) private employeeService: IEmployeeService) {}

  getEmployees = async (httpRequest) => {
    const { issuerId }: { issuerId: string | undefined } = httpRequest.params;
    const {
      page,
      perPage,
      showTrashed,
      q,
    }: { page: number; perPage: number; showTrashed: string; q: any } = httpRequest.query;

    const dto = new GetEmployeesDTO(issuerId, page, perPage, showTrashed, q);

    const employees = await this.employeeService.getEmployees(dto);

    return { body: employees };
  };

  findEmployee = async (httpRequest) => {
    const { employeeId }: { employeeId?: string } = httpRequest.params;

    const dto = {
      employeeId: employeeId,
    };
    const employee = await this.employeeService.findEmployee(dto);

    return {
      body: {
        status: 'success',
        data: employee,
      },
    };
  };

  updateEmployee = async (httpRequest) => {
    const {
      issuerId,
      employeeId,
    }: { issuerId?: string; employeeId?: string } = httpRequest.params;
    const { body } = httpRequest;

    const dto = UpdateEmployeeDTO.create({
      employeeId,
      issuerId,
      ...body,
    });

    if (httpRequest.file) {
      dto.setProfilePic(httpRequest.file.path);
    }

    await this.employeeService.updateEmployee(dto);

    return {
      body: {
        status: 'success',
        message: 'employee updated successfully',
      },
    };
  };

  removeEmployee = async (httpRequest) => {
    const { employeeId }: { employeeId: string } = httpRequest.params;
    const { hardDelete = 'false' }: { hardDelete: string } = httpRequest.query;

    const dto = new DeleteEmployeeDTO(employeeId, hardDelete);

    await this.employeeService.removeEmployee(dto);

    return {
      body: {
        status: 'success',
        message: 'employee deleted successfully',
      },
    };
  };

  createEmployee = async (httpRequest) => {
    const { issuerId }: { issuerId: string } = httpRequest.params;
    const { body } = httpRequest;

    const dto = CreateEmployeeDTO.create({
      issuerId,
      ...body,
    });

    if (httpRequest.file) {
      dto.setProfilePic(httpRequest.file.path);
    }

    await this.employeeService.createEmployee(dto);

    return {
      body: {
        status: 'success',
        message: 'employee created successfully',
      },
    };
  };
}

export default EmployeeController;
