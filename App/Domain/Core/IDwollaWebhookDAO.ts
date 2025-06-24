import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';
import DwollaWebhook from '@domain/Core/DwollaWebhook';
import { IBaseRepository } from '@domain/Core/BaseEntity/IBaseRepository';

export const IDwollaWebhookDAOId = Symbol.for('IDwollaWebhookDAO');
type DwollaWebhookOptions = {
  paginationOptions: PaginationOptions;
  showTrashed: boolean;
  query: string;
  dwollaCustomerId: string;
};
export interface IDwollaWebhookDAO extends IBaseRepository {
  fetchAll(options: DwollaWebhookOptions): Promise<any>;
  fetchAllByDate(date: Date): Promise<any>;
  fetchByResourceId(resourceId: string): Promise<DwollaWebhook>;
  fetchAllByResourceId(resourceId: string): Promise<DwollaWebhook[]>;
  fetchLatestRecordByResourceId(resourceId: string): Promise<DwollaWebhook>;
  fetchByEventId(eventId: string): Promise<DwollaWebhook>;
}
