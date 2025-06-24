import PaginationOptions from "@domain/Utils/PaginationOptions";

class getInvestorCampaignsInvestmentDTO {

    private investorId: string;
    private campaignId: string;
    private paginationOptions: PaginationOptions;

    constructor(investorId: string, campaignId: string, page: number, perPage: number) {
        this.investorId = investorId;
        this.campaignId = campaignId;
        this.paginationOptions = new PaginationOptions(page, perPage);
    }

    getInvestorId() {
        return this.investorId;
    }

    getCampaignId() {
        return this.campaignId;
    }

    getPaginationOptions() {
        return this.paginationOptions;
    }
}

export default getInvestorCampaignsInvestmentDTO;
