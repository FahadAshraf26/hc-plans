import { injectable } from 'inversify'
import DashboardDataService from '@application/DashboardData/DashboardDataService'

@injectable()
class DashboardDataController {
    constructor(private dashboardService: DashboardDataService) { }

    getTotalAmountOfCampaigns = async (httpRequest) => {
        const totalAmount = await this.dashboardService.getTotalAmountOfCampaigns();
        return {
            body: {
                status: 'success',
                data: totalAmount
            }
        };
    }

    getTotalAmountOfActiveCampaigns = async (httpRequest) => {
        const totalAmount = await this.dashboardService.getTotalAmountOfActiveCampaigns();
        return {
            body: {
                status: 'success',
                data: totalAmount
            }
        };
    }

}

export default DashboardDataController;
