import PaginationOptions from "@domain/Utils/PaginationOptions";
export class FetchInvestorProjectionsDTOWithPagination {
    private paginationOptions: PaginationOptions;
    private investorId: string;


    constructor(page: number, perPage: number, investorId: string) {
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
