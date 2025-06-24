export const IRepaymentsUpdateRepositoryId = Symbol.for('IRepaymentsUpdateRepository');

export interface IRepaymentsUpdateRepository {
  fetchLastUpdateDate(): Promise<any>;
  add(object): Promise<any>
}
