import EmployeeLog from '@domain/Core/EmployeeLog/EmployeeLog';
import { IEmployeeLogRepository } from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import { injectable } from 'inversify';
import Model from '@infrastructure/Model';
import BaseRepository from './BaseRepository';

const { EmployeeLogModel } = Model;

@injectable()
class EmployeeLogRepository extends BaseRepository implements IEmployeeLogRepository {
  constructor() {
    super(EmployeeLogModel, 'employeeLogId', EmployeeLog);
  }

  async fetchByIssuerId(issuerId: string): Promise<EmployeeLog> {
    const employeeLog = await EmployeeLogModel.findOne({
      where: { issuerId },
      order: [['createdAt', 'DESC']],
    });
    if (!employeeLog) {
      return null;
    }
    return EmployeeLog.createFomObject(employeeLog);
  }
}

export default EmployeeLogRepository;
