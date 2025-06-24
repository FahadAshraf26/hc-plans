import {
  IEmployeeLogRepository,
  IEmployeeLogRepositoryId,
} from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import { inject, injectable } from 'inversify';
import CreateEmployeeLogDTO from './CreateEmployeeLogDTO';
import EmployeeLog from '@domain/Core/EmployeeLog/EmployeeLog';
import { IEmployeeLogService } from './IEmployeeLogService';

@injectable()
class EmployeeLogService implements IEmployeeLogService {
  constructor(
    @inject(IEmployeeLogRepositoryId)
    private employeeLogRepository: IEmployeeLogRepository,
  ) {}

  async addEmployeeLog(createEmployeeLogDTO: CreateEmployeeLogDTO) {
    const alreadyExistEmployeeLog = await this.employeeLogRepository.fetchByIssuerId(
      createEmployeeLogDTO.getIssuerId(),
    );
    if (alreadyExistEmployeeLog) {
      if (
        alreadyExistEmployeeLog.getEmployeeCount() !==
          createEmployeeLogDTO.getEmployeeCount() ||
        alreadyExistEmployeeLog.getUpdatedEmployeeCount() !==
          createEmployeeLogDTO.getUpdatedEmployeeCount()
      ) {
        
        const newEmployeeLog = {
          ...alreadyExistEmployeeLog,
          employeeCount: createEmployeeLogDTO.getEmployeeCount(),
          updatedEmployeeCount: createEmployeeLogDTO.getUpdatedEmployeeCount(),
        };
        
        return this.employeeLogRepository.update(newEmployeeLog, {
          issuerId: alreadyExistEmployeeLog.getIssuerId(),
        });
      } else {
        this.employeeLogRepository.update(alreadyExistEmployeeLog, {
          issuerId: alreadyExistEmployeeLog.getIssuerId(),
        });
      }
    } else {
      const employeeLog = EmployeeLog.createFromDetail({
        employeeCount: createEmployeeLogDTO.getEmployeeCount(),
        updatedEmployeeCount: createEmployeeLogDTO.getUpdatedEmployeeCount(),
      });
      employeeLog.setIssuerId(createEmployeeLogDTO.getIssuerId());
      return this.employeeLogRepository.add(employeeLog);
    }
  }
}

export default EmployeeLogService;
