export const IDeleteProjectionReturnsId = Symbol.for('IDeleteProjectionReturns');
export interface IDeleteProjectionReturns {
  execute(campaignId: string): Promise<any>;
}
