import BaseEntity from '../BaseEntity/BaseEntity';
import uuid from 'uuid/v4';

class EmployeeLog extends BaseEntity {
  private employeeLogId: string;
  private employeeCount: number;
  private updatedEmployeeCount: number;
  private issuerId: string;

  constructor({ employeeLogId, employeeCount, updatedEmployeeCount }) {
    super();
    this.employeeLogId = employeeLogId;
    this.employeeCount = employeeCount;
    this.updatedEmployeeCount = updatedEmployeeCount;
  }

  setIssuerId(issuerId) {
    this.issuerId = issuerId;
  }

  static createFomObject(employeeLogObj): EmployeeLog {
    const employeeLog = new EmployeeLog(employeeLogObj);
    if (employeeLogObj.createdAt) {
      employeeLog.setCreatedAt(employeeLogObj.createdAt);
    }
    if (employeeLogObj.updatedAt) {
      employeeLog.setUpdatedAt(employeeLogObj.updatedAt);
    }
    if (employeeLogObj.deletedAt) {
      employeeLog.setDeletedAT(employeeLogObj.deletedAt);
    }
    if (employeeLogObj.issuerId) {
      employeeLog.setIssuerId(employeeLogObj.issuerId)
    }
    return employeeLog;
  }

  getEmployeeCount() {
    return this.employeeCount;
  }

  getUpdatedEmployeeCount() {
    return this.updatedEmployeeCount;
  }

  getIssuerId() {
    return this.issuerId;
  }

  static createFromDetail(props): EmployeeLog {
    return new EmployeeLog({
      employeeLogId: uuid(),
      ...props,
    });
  }
}

export default EmployeeLog;
