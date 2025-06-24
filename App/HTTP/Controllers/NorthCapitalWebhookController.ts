import NorthCapitalWebhookType from '@domain/NorthCapitalWebhooks/NorthCapitalWebhookType';
import { inject, injectable } from 'inversify';
import {
  IHandleNorthCapitalWebhookUseCase,
  IHandleNorthCapitalWebhookUseCaseId,
} from '@application/Webhooks/NorthCapital/handleNorthCapitalWebhook/IHandleNorthCapitalWebhookUseCase';

@injectable()
class NorcapWebhookController {
  constructor(
    @inject(IHandleNorthCapitalWebhookUseCaseId)
    private handleNorthCapitalWebhookUseCase: IHandleNorthCapitalWebhookUseCase,
  ) {}

  northCapitalWebhook = (webhookType) => async (req, res) => {
    const { body: payload } = req;

    res.status(200).send({
      status: 'success',
    });

    const dto = {
      payload,
      webhookType,
    };

    await this.handleNorthCapitalWebhookUseCase.execute(dto);
  };

  createTradeHook = this.northCapitalWebhook(NorthCapitalWebhookType.CreateTrade());

  updateTradeStatusHook = this.northCapitalWebhook(
    NorthCapitalWebhookType.UpdateTradeStatus(),
  );

  updateAiVerificationHook = this.northCapitalWebhook(
    NorthCapitalWebhookType.UpdateAiVerification(),
  );

  createPartyHook = this.northCapitalWebhook(NorthCapitalWebhookType.CreateParty());

  createAccountHook = this.northCapitalWebhook(NorthCapitalWebhookType.CreateAccount());

  updateCCFundMoveStatus = this.northCapitalWebhook(
    NorthCapitalWebhookType.UpdateCCFundMoveStatus(),
  );

  updateBankFundMoveStatus = this.northCapitalWebhook(
    NorthCapitalWebhookType.UpdateBankFundMoveStatus(),
  );
}

export default NorcapWebhookController;
