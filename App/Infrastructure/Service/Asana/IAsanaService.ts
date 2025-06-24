export const IAsanaServiceId = Symbol.for('IAsanaService');

export interface IAsanaService {
  fetchAllTasks(projectId: string):Promise<any>;
  fetchTaskByGid(taskGid: string): Promise<any>;
  createTaskForDwollaRefunds(amount: number, debitAuthorizationId: string, investorDetails: any): Promise<any>;
}
