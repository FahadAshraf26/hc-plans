export const IOmniBusReportId = Symbol.for('IOmniBusReport');

export interface IOmniBusReport {
  execute(campaign: any): Promise<boolean>;
}
