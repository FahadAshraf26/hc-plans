import PaginationOptions from '../../Domain/Utils/PaginationOptions';

class GetInvitationDTO {
  private readonly initiator: string;
  private readonly showTrashed: boolean;
  private readonly paginationOptions: PaginationOptions;

  constructor(initiator: string, page: number, perPage: number, showTrashed: boolean) {
    this.initiator = initiator;
    this.showTrashed = showTrashed;
    this.paginationOptions = new PaginationOptions(page, perPage);
  }

  getInitiator() {
    return this.initiator;
  }

  getPaginationOptions() {
    return this.paginationOptions;
  }

  isShowTrashed() {
    return this.showTrashed === true;
  }
}

export default GetInvitationDTO;
