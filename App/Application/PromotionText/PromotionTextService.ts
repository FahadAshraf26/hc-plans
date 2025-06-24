import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import { inject, injectable } from 'inversify';
import { IPromotionTextService } from '@application/PromotionText/IPromotionTextService';
import { IPromotionTextRepository, IPromotionTextRepositoryId } from '@domain/Core/PromotionText/IPromotionTextRepository';
import config from '@infrastructure/Config';
import AddPromotionTextDTO from '@application/PromotionText/AddPromotionTextDTO';
import PromotionText from '@domain/Core/PromotionText/PromotionText';

const { slackConfig } = config;

@injectable()
class PromotionTextService implements IPromotionTextService {
  constructor(
    @inject(IPromotionTextRepositoryId)
    private promotionTextRepository: IPromotionTextRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
  ) {}

  async addPromotionText(addPromtionTextDTO: AddPromotionTextDTO): Promise<boolean> {
    await this.promotionTextRepository.add(
      addPromtionTextDTO.getPromotionText(),
    );
    await this.slackService.publishMessage({
      message: `${addPromtionTextDTO.getEmail()} updated promotion texts`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    })

    return true;
  }

  async fetchLatestPromotionText(): Promise<PromotionText | null> {
    return this.promotionTextRepository.fetchLatestRecord();
  }
}

export default PromotionTextService; 