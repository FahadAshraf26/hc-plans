import PaginationOptions from "@domain/Utils/PaginationOptions";
export class FetchInvestorProjectionsDTOWithoutPagination {
    private investorId: string;

    constructor(investorId: string) {
        this.investorId = investorId;
    }

    getInvestorId() {
        return this.investorId;
    }

}
