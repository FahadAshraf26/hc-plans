import PaginationOptions from "@domain/Utils/PaginationOptions";

class InvestorInvestmentOnCampaignsWithPaginationDTO {

    private paginationOptions: PaginationOptions;
    private investorId: string;


    constructor(investorId: string, page: number, perPage: number,) {
        this.paginationOptions = new PaginationOptions(page, perPage);
        this.investorId = investorId;

    }

    getPaginationOptions() {
        return this.paginationOptions;
    }

    getInvestorId() {
        return this.investorId;
    }
}

export default InvestorInvestmentOnCampaignsWithPaginationDTO;
