import moment from "moment";
class ExportEducationalDataDTO {
  private startDate?: Date;
  private endDate?: Date;

  constructor(startDate, endDate) {
    this.startDate = startDate
    this.endDate = endDate;
  }

  getStartDate() {
    const newStartDate = moment().day(-30).format('YYYY-MM-DD HH:mm:ss')
    return !!this.startDate ? new Date(this.startDate) : new Date(newStartDate);
  }

  getEndDate() {
    const newEndDate = moment().format('YYYY-MM-DD HH:mm:ss');
    return !!this.endDate ? new Date(this.endDate) : new Date(newEndDate);
  }
}
export default ExportEducationalDataDTO;
