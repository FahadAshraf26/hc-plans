import { inject, injectable } from 'inversify';
import { IPromotionTextService, IPromotionTextServiceId } from '@application/PromotionText/IPromotionTextService';
import AddPromotionTextDTO from '@application/PromotionText/AddPromotionTextDTO';

@injectable()
class PromotionTextController {
  constructor(
    @inject(IPromotionTextServiceId)
    private promotionTextService: IPromotionTextService,
  ) {}

  addPromotionText = async (req) => {
    const input = new AddPromotionTextDTO(req.adminUser.email, req.body);
    await this.promotionTextService.addPromotionText(input);

    return {
      body: {
        status: 'success',
        message: 'Honeycomb Promotion Texts  Updated Successfully'
      },
    };
  };

  fetchPromotionText = async (req) => {
    const configuration = await this.promotionTextService.fetchLatestPromotionText();
    return {
      body: {
        status: 'success',
        data: configuration,
      },
    };
  };
}

export default PromotionTextController; 