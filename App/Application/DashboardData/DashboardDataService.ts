import moment from 'moment'
import {
    ICampaignFundRepository,
    ICampaignFundRepositoryId
} from '@domain/Core/CampaignFunds/ICampaignFundRepository'
import { inject, injectable } from 'inversify';

@injectable()
class DashboardDataService {
    constructor(@inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository) { }

    async getTotalAmountOfCampaigns() {
        const currentDate = moment([moment().year(), moment().month(), moment().date()])
        const yearStartDate = moment([moment().year(), 0, 1]).format('YYYY-MM-DD')
        const currentDaysInYear = currentDate.diff(yearStartDate, 'days');
        const quarterStartDate = moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD');
        const currentDaysInQuarter = currentDate.diff(quarterStartDate, 'days') + 1;
        const totalPreviousDays = (currentDaysInYear - currentDaysInQuarter);
        const previousQuartersDate = moment(`${moment().year()}-01-01`).add(totalPreviousDays, 'days').format('YYYY-MM-DD');
        return this.campaignFundRepository.fetchTotalAmountOfCampaigns(quarterStartDate, previousQuartersDate, yearStartDate, currentDate);
    }

    async getTotalAmountOfActiveCampaigns() {
        return this.campaignFundRepository.fetchTotalAmountOfActiveCampaigns();
    }
}

export default DashboardDataService;
