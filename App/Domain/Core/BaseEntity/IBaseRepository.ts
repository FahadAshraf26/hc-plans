import PaginationOptions from '@domain/Utils/PaginationOptions';
import PaginationData from '@domain/Utils/PaginationData';

type CustomCriteriaOptions = {
  whereConditions?: {};
  paginationOptions?: PaginationOptions;
  showTrashed?: boolean;
  includes?: Array<any>;
  raw?: boolean;
  populateModel?: boolean;
  order?: any;
};

export interface IBaseRepository {
  add?(entityObj: {}): Promise<boolean>;
  addBulk?(entityObj: {}): Promise<boolean>;
  fetchById?(entityId: string, options?: any): Promise<any>;
  fetchOneByCustomCritera?(options: any): Promise<any>;
  fetchAll?({
    whereConditions,
    paginationOptions,
    showTrashed,
    includes,
    raw,
    populateModel,
  }: CustomCriteriaOptions): Promise<PaginationData<any>>;
  update?(entityObj: {}, whereConditions?: {}): Promise<boolean>;
  remove?(entityObj: {}, hardDelete?: boolean);
  restore?(entityObj: {}): Promise<any>;
}
