class GetUsersEmailDTO {
  private readonly usersType: string;
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(usersType: string, startDate: Date, endDate: Date) {
    this.usersType = usersType;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getUsersType() {
    return this.usersType;
  }

  getStartDate() {
    let date: any = !!this.startDate ? new Date(this.startDate) : '';
    date = !!date && isNaN(date.getDate()) ? '' : date;
    return date;
  }

  getEndDate() {
    let date: any = !!this.endDate ? new Date(this.endDate) : '';
    date = !!date && isNaN(date.getDate()) ? '' : date;
    return date;
  }
}

export default GetUsersEmailDTO;
