import ReconfirmOfferingChangeDTO from '@application/CampaignOfferingChange/ReconfirmOfferingChangeDTO';
import TriggerOfferingChangesDTO from '@application/Campaign/TriggerOfferingChangesDTO';

export const ICampaignOfferingChangeServiceId = Symbol.for(
  'ICampaignOfferingChangeService',
);
export interface ICampaignOfferingChangeService {
  reconfirmCampaignOfferingChange(
    reconfirmOfferingChangeDTO: ReconfirmOfferingChangeDTO,
  ): Promise<any>;
  triggerOfferingChanges(
    triggerOfferingChangesDTO: TriggerOfferingChangesDTO,
  ): Promise<any>;
}
