class SummaryDTO {
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
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

export default SummaryDTO;
