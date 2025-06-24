export const ILoanwellInfraServiceId = Symbol.for('ILoanwellInfraService');

export interface ILoanwellInfraService {
  fetchBusinessNames();
  fetchData({ campaignName }: { campaignName?: string[] });
}
