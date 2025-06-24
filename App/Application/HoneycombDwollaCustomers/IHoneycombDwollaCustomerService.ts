import GetHoneycombWalletDetailDTO from './GetHoneycombWalletDetailDTO';
export const IHoneycombDwollaCustomerServiceId = Symbol.for(
  'IHoneycombDwollaCustomerService',
);
export interface IHoneycombDwollaCustomerService {
  getHoneycombWalletDetail(
    getHoneycombWalletDetailDTO: GetHoneycombWalletDetailDTO,
  ): Promise<any>;
}
