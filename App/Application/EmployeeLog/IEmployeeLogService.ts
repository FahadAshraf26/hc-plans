import CreateEmployeeLogDTO from "./CreateEmployeeLogDTO";

export const IEmployeeLogServiceId = Symbol.for('IEmployeeLogService');

export interface IEmployeeLogService {
  addEmployeeLog(createEmployeeLogDTO: CreateEmployeeLogDTO): Promise<boolean>
}