import { inject, injectable } from 'inversify';
import { IPlaidIDVUseCase, IPlaidIDVUseCaseId } from '@application/User/doKycCheck/IPlaidIDVUseCase';
import { IPlaidWebhook } from './IPlaidWebhook';
import PlaidIDVWebhookDTO from './PlaidIDVWebhookDTO';
import HttpError from '@infrastructure/Errors/HttpException';

@injectable()
class PlaidWebhook implements IPlaidWebhook {
  constructor(
    @inject(IPlaidIDVUseCaseId) private readonly plaidIDVUseCase: IPlaidIDVUseCase,
  ) {}

  async execute(webhookDTO: PlaidIDVWebhookDTO): Promise<void> {
    if (webhookDTO.webhookType === 'IDENTITY_VERIFICATION' && webhookDTO.webhookCode === 'STATUS_UPDATED') {
      try {
        await this.plaidIDVUseCase.execute({
          userId: webhookDTO.userId,
          verificationId: webhookDTO.verificationId,
          requestOrigin: webhookDTO.requestOrigin,
          ip: webhookDTO.ip
        });
      } catch (error) {
        throw new HttpError(500, 'Failed to process Plaid webhook');
      }
    }
  }
}

export default PlaidWebhook; 