import { RequestOrigin } from '@domain/Core/ValueObjects/RequestOrigin';
import PaginationOptions from '@domain/Utils/PaginationOptions';

class InvestmentsDTO {
  private userId: string;
  private paginationOptions: PaginationOptions;
  private showTrashed: string;
  private grouped: string;
  private includeRefunded: string;
  private includeFailed: string;
  private includePending: string;
  private entityId: string;
  private all: string;
  private requestOrigin: string;

  constructor({
    userId,
    page,
    perPage = 20,
    showTrashed = 'false',
    grouped = 'true',
    includeFailed = 'false',
    includeRefunded = 'false',
    includePending,
    entityId = null,
    all = 'false',
    requestOrigin = null,
  }) {
    this.userId = userId;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
    this.grouped = grouped;
    this.includeRefunded = includeRefunded;
    this.includeFailed = includeFailed;
    this.includePending = includePending;
    this.entityId = entityId;
    this.all = all;
    this.requestOrigin = requestOrigin;
  }

  getUserId(): string {
    return this.userId;
  }

  getPaginationOptions(): PaginationOptions {
    return this.paginationOptions;
  }

  getEntityId(): string {
    return this.entityId;
  }

  getAll(): string {
    return this.all;
  }

  isAdminRequest() {
    return this.requestOrigin === RequestOrigin.ADMIN_PANEL;
  }

  isShowTrashed(): boolean {
    return this.showTrashed === 'true';
  }

  isShowGrouped(): boolean {
    return typeof this.grouped === 'string' ? this.grouped === 'true' : this.grouped;
  }

  shouldIncludeFailed(): boolean {
    return typeof this.includeFailed === 'string'
      ? this.includeFailed === 'true'
      : !!this.includeFailed;
  }

  shouldIncludeRefunded(): boolean {
    return typeof this.includeRefunded === 'string'
      ? this.includeRefunded === 'true'
      : !!this.includeRefunded;
  }

  shouldIncludePending(): boolean {
    return typeof this.includePending === 'string'
      ? this.includePending === 'true'
      : !!this.includePending;
  }
}

export default InvestmentsDTO;
