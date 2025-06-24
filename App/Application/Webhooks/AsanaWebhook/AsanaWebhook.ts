import { injectable, inject } from 'inversify';
import { IAsanaWebhook } from './IAsanaWebhook';
import {
  IAsanaTicketApprovedId,
  IAsanaTicketApproved,
} from './WebhookHandler/Approved/IAsanaTicketApproved';

@injectable()
class AsanaWebhook implements IAsanaWebhook {
  constructor(
    @inject(IAsanaTicketApprovedId)
    private asanaTicketApproved: IAsanaTicketApproved,
  ) { }

  async handleAsanaWebhook(status: string, debitAuthorizationId: string): Promise<any> {
    if (status === 'Approved') {
      this.asanaTicketApproved.execute(debitAuthorizationId);
    }
  }
}

export default AsanaWebhook;
