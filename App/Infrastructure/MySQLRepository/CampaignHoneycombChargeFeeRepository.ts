import BaseRepository from '@infrastructure/MySQLRepository/BaseRepository';
import models from '@infrastructure/Model';
import CampaignHoneycombChargeFee from '@domain/Core/CampaignHoneycombChargeFee/CampaignHoneycombChargeFee';
import {injectable} from 'inversify';
import {ICampaignHoneycombChargeFeeRepository} from '@domain/Core/CampaignHoneycombChargeFee/ICampaignHoneycombChargeFeeRepository';

const {CampaignHoneycombChargeFeeModel} = models;

@injectable()
class CampaignHoneycombChargeFeeRepository extends BaseRepository implements ICampaignHoneycombChargeFeeRepository {
    constructor() {
        super(CampaignHoneycombChargeFeeModel, 'campaignHoneycombChargeFeeId', CampaignHoneycombChargeFee);
    }
}

export default CampaignHoneycombChargeFeeRepository;
