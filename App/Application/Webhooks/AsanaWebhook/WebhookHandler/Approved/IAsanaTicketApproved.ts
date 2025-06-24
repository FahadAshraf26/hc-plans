export const IAsanaTicketApprovedId = Symbol.for('IAsanaTicketApproved');
export interface IAsanaTicketApproved {
  execute(debitAuthorizationId: string): Promise<any>;
}
