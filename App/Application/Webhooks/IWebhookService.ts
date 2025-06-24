import DwollaWebhookDTO from '@application/Webhooks/DwollaWebhookDTO';
import User from '@domain/Core/User/User';
import IdologyWebhookDTO from '@application/Webhooks/IdologyWebhookDTO';
import InvestReadyWebhookDTO from '@application/Webhooks/InvestReadyWebhookDTO';
import GetAllWebhookResponsesDTO from './GetAllWebhookResponsesDTO';

export const IWebhookServiceId = Symbol.for('IWebhookService');

export interface IWebhookService {
  handleDwollaWebhook(dwollaWebhookDTO: DwollaWebhookDTO): Promise<boolean>;
  getUnhandledEvents(dateToFilterBy: Date, reProcess: boolean): Promise<any>;
  retryDwollaWebhooks(date: Date, reProcess: boolean): Promise<void>;
  handleInvestReadyWebhook(
    handleInvestReadyWebhookDTO: InvestReadyWebhookDTO,
  ): Promise<boolean>;
  sendSlackNotification(user: User, kycStatus: string): Promise<void>;
  handleIdologyWebhook(IdologyWebhookDTO: IdologyWebhookDTO): Promise<any>;
  getAllWebhookResponses(
    getAllWebhookResponsesDTO: GetAllWebhookResponsesDTO,
  ): Promise<any>;
  verifyAsanaWebhookSignature(payload: any, receivedSignature: string): Promise<boolean>;
  handleAsanaWebhook(events: any[]): Promise<void>;
  handleDwollaTransferUpdate(
    transferId: string,
    status: string,
    resourceUrl?: string,
    failureCode?: string,
    failureDescription?: string,
  ): Promise<void>;
}
