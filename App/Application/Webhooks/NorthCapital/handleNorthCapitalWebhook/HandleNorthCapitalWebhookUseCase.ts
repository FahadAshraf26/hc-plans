import NorthCapitalWebhookStatus from '../../../../Domain/NorthCapitalWebhooks/NorthCapitalWebhookStatus';
import NorthCapitalWebhook from '../../../../Domain/NorthCapitalWebhooks/NorthCapitalWebhook';
import Logger from '../../../../Infrastructure/Logger/logger';
import {inject, injectable} from 'inversify';
import {
    INorthCapitalWebhookRepository,
    INorthCapitalWebhookRepositoryId,
} from '@domain/NorthCapitalWebhooks/INorthCapitalWebhookRepository';
import {
    IUncaughtExceptionService,
    IUncaughtExceptionServiceId,
} from '@application/UncaughtException/IUncaughtExceptionService';
import {IHandleNorthCapitalWebhookUseCase} from '@application/Webhooks/NorthCapital/handleNorthCapitalWebhook/IHandleNorthCapitalWebhookUseCase';
import {
    INorthCapitalEventHandlerFactory,
    INorthCapitalEventHandlerFactoryId
} from "@application/Webhooks/NorthCapital/webhookHandlers/INorthCapitalEventHandlerFactory";

@injectable()
class HandleNorthCapitalWebhookUseCase implements IHandleNorthCapitalWebhookUseCase {
    constructor(
        @inject(INorthCapitalWebhookRepositoryId)
        private northCapitalWebHookRepository: INorthCapitalWebhookRepository,
        @inject(IUncaughtExceptionServiceId)
        private uncaughtExceptionService: IUncaughtExceptionService,
        @inject(INorthCapitalEventHandlerFactoryId) private northCapitalEventHandlerFactory: INorthCapitalEventHandlerFactory
    ) {
    }

    async execute(dto) {
        try {
            const northCapitalWebhook = NorthCapitalWebhook.create({
                ...dto,
                status: NorthCapitalWebhookStatus.Pending(),
            });

            await this.northCapitalWebHookRepository.add(northCapitalWebhook);
            const handler: any = this.northCapitalEventHandlerFactory.createHandlerFromTopic(
                northCapitalWebhook.webhookType(),
            );

            if (!handler) {
                northCapitalWebhook.setStatus(NorthCapitalWebhookStatus.Success());
                await this.northCapitalWebHookRepository.update(northCapitalWebhook);
                return;
            }

            try {
                await handler.execute(northCapitalWebhook);
                northCapitalWebhook.setStatus(NorthCapitalWebhookStatus.Success());
                await this.northCapitalWebHookRepository.update(northCapitalWebhook);
            } catch (err) {
                northCapitalWebhook.setStatus(NorthCapitalWebhookStatus.Failed());
                await this.northCapitalWebHookRepository.update(northCapitalWebhook);
                throw err;
            }
        } catch (err) {
            Logger.error(err);
            await this.uncaughtExceptionService.logException(
                {
                    origin: 'NorthCapitalWebhook',
                    details: dto,
                },
                err,
            );
        }
    }
}

export default HandleNorthCapitalWebhookUseCase;
