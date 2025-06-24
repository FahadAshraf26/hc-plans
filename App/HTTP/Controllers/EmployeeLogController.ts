import CreateEmployeeLogDTO from "@application/EmployeeLog/CreateEmployeeLogDTO";
import { IEmployeeLogService, IEmployeeLogServiceId } from "@application/EmployeeLog/IEmployeeLogService";
import { inject, injectable } from "inversify";

@injectable()
class EmployeeLogController {
  constructor(@inject(IEmployeeLogServiceId) private employeeLogService: IEmployeeLogService) {}


  addEmployeeLog = async (httpRequest) => {
    const { issuerId } = httpRequest.params;
    const { employeeCount, updatedEmployeeCount } = httpRequest.body;
    const input = new CreateEmployeeLogDTO(issuerId, employeeCount, updatedEmployeeCount);
    await this.employeeLogService.addEmployeeLog(input);
    return {
      body: {
        status: "success",
        message:"Employee log added!"
      }
    }
  }

}

export default EmployeeLogController;