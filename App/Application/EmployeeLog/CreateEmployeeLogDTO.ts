class CreateEmployeeLogDTO {
  private issuerId: string;
  private employeeCount: number;
  private updatedEmployeeCount: number;

  constructor(issuerId: string,employeeCount: number, updatedEmployeeCount: number) {
    this.issuerId = issuerId;
    this.employeeCount = employeeCount;
    this.updatedEmployeeCount = updatedEmployeeCount;
  }
  
  getIssuerId() {
    return this.issuerId;
  }

  getEmployeeCount() {
    return this.employeeCount;
  }

  getUpdatedEmployeeCount() {
    return this.updatedEmployeeCount;
  }
}

export default CreateEmployeeLogDTO;
