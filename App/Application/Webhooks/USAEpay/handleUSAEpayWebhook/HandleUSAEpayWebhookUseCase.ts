import USAEpayWebhookStatus from '@domain/USAEpayWebhooks/USAEpayWebhookStatus';
import USAEpayWebhook from '@domain/USAEpayWebhooks/USAEpayWebhook';
import Logger from '@infrastructure/Logger/logger';
import { inject, injectable } from 'inversify';
import {
  IUSAEpayWebhookRepository,
  IUSAEpayWebhookRepositoryId,
} from '@domain/USAEpayWebhooks/IUSAEpayWebhookRepository';
import {
  IUncaughtExceptionService,
  IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';
import { IHandleUSAEpayWebhookUseCase } from '@application/Webhooks/USAEpay/handleUSAEpayWebhook/IHandleUSAEpayWebhookUseCase';
import USAEPayWebhookType from '@domain/USAEpayWebhooks/USAEpayWebhookType';
import {
  IHybridTransactionRepoistory,
  IHybridTransactionRepoistoryId,
} from '@domain/Core/HybridTransactions/IHybridTransactionRepository';
import { ChargeStatus } from '@domain/Core/ValueObjects/ChargeStatus';
import {
  ICampaignFundRepository,
  ICampaignFundRepositoryId,
} from '@domain/Core/CampaignFunds/ICampaignFundRepository';
import {
  IChargeRepository,
  IChargeRepositoryId,
} from '@domain/Core/Charge/IChargeRepository';
import TransactionType from '@domain/Core/CampaignFunds/TransactionType';
import { IDwollaService, IDwollaServiceId } from '@infrastructure/Service/IDwollaService';
import logger from '@infrastructure/Logger/logger';

@injectable()
class HandleUSAEpayWebhookUseCase implements IHandleUSAEpayWebhookUseCase {
  constructor(
    @inject(ICampaignFundRepositoryId)
    private campaignFundRepository: ICampaignFundRepository,
    @inject(IHybridTransactionRepoistoryId)
    private hybridTransactionRepoistory: IHybridTransactionRepoistory,
    @inject(IChargeRepositoryId) private chargeRepository: IChargeRepository,
    @inject(IUSAEpayWebhookRepositoryId)
    private usaEpayWebHookRepository: IUSAEpayWebhookRepository,
    @inject(IUncaughtExceptionServiceId)
    private uncaughtExceptionService: IUncaughtExceptionService,
    @inject(IDwollaServiceId) private dwollaService: IDwollaService,
  ) {}

  async execute(dto) {
    try {
      if (dto.webhookType.value() === USAEPayWebhookType.AchFailed().value()) {
        await this.handleAchFailed(dto);
      } else if (dto.webhookType.value() === USAEPayWebhookType.AchSettled().value()) {
        await this.handleAchSettled(dto);
      } else if (dto.webhookType.value() === USAEPayWebhookType.AchVoided().value()) {
        await this.handleAchVoided(dto);
      } else {
        Logger.info(dto);
      }
    } catch (err) {
      Logger.error(err);
      await this.uncaughtExceptionService.logException(
        {
          origin: 'USAEPayWebhook',
          details: dto,
        },
        err,
      );
    }
  }

  handleTransactionSalesFailure = async (dto) => {
    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: USAEpayWebhookStatus.Failed(),
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );
    const status = ChargeStatus.FAILED;
    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }

    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };

  handleTransactionSalesSuccess = async (dto) => {
    let status = ChargeStatus.PENDING;

    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: status,
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );

    if (hybridTransaction.getTransactionType() === TransactionType.ACH().getValue()) {
      if (payload.event_body.object.result_code === 'A') {
        status = ChargeStatus.SUCCESS;
      }
    }

    if (hybridTransaction.getTransactionType() === TransactionType.Hybrid().getValue()) {
      if (hybridTransaction.getDwollaTransactionId()) {
        const response = await this.dwollaService.retrieveTransfer(
          hybridTransaction.getDwollaTransactionId(),
        );
        if (
          response.status === 'processed' &&
          response.status === ChargeStatus.SUCCESS &&
          payload.event_body.object.result_code === 'A'
        ) {
          status = ChargeStatus.SUCCESS;
        }
      }
    }

    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }

    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };

  handleTransactionSalesVoid = async (dto) => {
    let status = ChargeStatus.CANCELLED;

    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: status,
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );

    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }

    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };

  handleAchFailed = async (dto) => {
    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: ChargeStatus.FAILED,
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );
    const status = ChargeStatus.FAILED;
    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }
    logger.info('USAePay payment is failed');
    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };

  handleAchSettled = async (dto) => {
    let status = ChargeStatus.SUCCESS;

    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: ChargeStatus.SUCCESS,
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );

    if (hybridTransaction.getTransactionType() === TransactionType.Hybrid().getValue()) {
      if (hybridTransaction.getDwollaTransactionId()) {
        const response = await this.dwollaService.retrieveTransfer(
          hybridTransaction.getDwollaTransactionId(),
        );
        if (response.status === 'processed') {
          status = ChargeStatus.SUCCESS;
        } else {
          status = ChargeStatus.PENDING;
        }
      }
    }

    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }
    logger.info('USAePay payment is settled');
    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };

  handleAchVoided = async (dto) => {
    let status = ChargeStatus.CANCELLED;

    const usaEpayWebhook = USAEpayWebhook.create({
      ...dto,
      status: status,
    });
    const payload = usaEpayWebhook.payload();
    const hybridTransaction = await this.hybridTransactionRepoistory.fetchByTradeId(
      payload.event_body.object.key,
    );

    hybridTransaction.setStatus(status);
    await this.hybridTransactionRepoistory.update(hybridTransaction);
    const campaignFund = await this.campaignFundRepository.fetchById(
      hybridTransaction.getCampaignFundId(),
    );
    if (campaignFund) {
      const charge = campaignFund.Charge();
      charge.setChargeStatus(status);
      await this.chargeRepository.update(charge);
    }
    logger.info('USAePay payment is voided');
    await this.usaEpayWebHookRepository.add(usaEpayWebhook);
  };
}

export default HandleUSAEpayWebhookUseCase;
