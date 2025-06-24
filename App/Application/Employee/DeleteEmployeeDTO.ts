class DeleteEmployeeDTO {
  private employeeId: string;
  private hardDelete: string;

  constructor(employeeId, hardDelete) {
    this.employeeId = employeeId;
    this.hardDelete = hardDelete;
  }

  getEmployeeId() {
    return this.employeeId;
  }

  shouldHardDelete() {
    return this.hardDelete === 'true';
  }
}

export default DeleteEmployeeDTO;
