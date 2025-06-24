class InvestorInvestmentOnCampaignsWithoutPaginationDTO {

    private investorId: string;

    constructor(investorId: string) {
        this.investorId = investorId
    }

    getInvestorId() {
        return this.investorId;
    }
}

export default InvestorInvestmentOnCampaignsWithoutPaginationDTO;
