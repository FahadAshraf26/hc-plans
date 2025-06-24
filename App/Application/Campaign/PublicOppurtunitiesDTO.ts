import PaginationOptions from '@domain/Utils/PaginationOptions';
import { CampaignStage } from '@domain/Core/ValueObjects/CampaignStage';

class PublicOppurtunitiesDTO {
  private campaignStage: string;
  private page: number;
  private perPage: number;
  private showTrashed: boolean;
  private paginationOptions: PaginationOptions;

  /**
   * @param {string} campaignStage
   * @param {number} page
   * @param {number} perPage
   * @param {(boolean|("true"|"false"))} showTrashed
   */
  constructor(
    campaignStage: string = CampaignStage.FUNDRAISING,
    page: number,
    perPage: number,
    showTrashed: boolean = false,
  ) {
    this.campaignStage = campaignStage;
    this.paginationOptions = new PaginationOptions(page, perPage);
    this.showTrashed = showTrashed;
  }

  /**
   * get campaign stage to filter by
   */
  getCampaignStage() {
    return this.campaignStage;
  }

  /**
   * get pagination rules to apply
   */
  getPaginationOptions() {
    return this.paginationOptions;
  }

  /**
   * whether to include deleted promotions
   */
  isShowTrashed() {
    return this.showTrashed === true;
  }
}

export default PublicOppurtunitiesDTO;
