import {IBaseRepository} from '@domain/Core/BaseEntity/IBaseRepository';

export const ICampaignHoneycombChargeFeeId = Symbol.for(
    'ICampaignHoneycombChargeFeeRepository',
);

export interface ICampaignHoneycombChargeFeeRepository extends IBaseRepository {
}
