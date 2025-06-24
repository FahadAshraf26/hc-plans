import NorthCapitalWebhookType from '@domain/NorthCapitalWebhooks/NorthCapitalWebhookType';
import {
    ICreateAccountWebhookHandler,
    ICreateAccountWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/createAccountWebhookHandler/ICreateAccountWebhookHandler";
import {
    ICreatePartyWebhookHandler,
    ICreatePartyWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/createPartyWebhookHandler/ICreatePartyWebhookHandler";
import {
    ICreateTradeWebhookHandler,
    ICreateTradeWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/createTradeWebhookHandler/ICreateTradeWebhookHandler";
import {
    IUpdateAiVerificationWebhookHandler,
    IUpdateAiVerificationWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/updateAiVerificationWebhookHandler/IUpdateAiVerificationWebhookHandler";
import {
    IUpdateBankFundMoveStatusWebhookHandler,
    IUpdateBankFundMoveStatusWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/updateBankFundMoveStatusWebhookHandler/IUpdateBankFundMoveStatusWebhookHandler";
import {
    IUpdateCCFundMoveStatusWebhookHandler,
    IUpdateCCFundMoveStatusWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/updateCCFundMoveStatusWebhookHandler/IUpdateCCFundMoveStatusWebhookHandler";
import {
    IUpdateTradeStatusWebhookHandler,
    IUpdateTradeStatusWebhookHandlerId
} from "@application/Webhooks/NorthCapital/webhookHandlers/updateTradeStatusWebhookHandler/IUpdateTradeStatusWebhookHandler";
import {inject, injectable} from "inversify";
import {INorthCapitalEventHandlerFactory} from "@application/Webhooks/NorthCapital/webhookHandlers/INorthCapitalEventHandlerFactory";

@injectable()
class NorthCapitalEventHandlerFactory implements INorthCapitalEventHandlerFactory {
    constructor(@inject(ICreateAccountWebhookHandlerId) private createAccountWebhookHandler: ICreateAccountWebhookHandler,
                @inject(ICreatePartyWebhookHandlerId) private createPartyWebhookHandler: ICreatePartyWebhookHandler,
                @inject(ICreateTradeWebhookHandlerId) private createTradeWebhookHandler: ICreateTradeWebhookHandler,
                @inject(IUpdateAiVerificationWebhookHandlerId) private updateAiVerificationWebhookHandler: IUpdateAiVerificationWebhookHandler,
                @inject(IUpdateBankFundMoveStatusWebhookHandlerId) private updateBankFundMoveStatusWebhookHandler: IUpdateBankFundMoveStatusWebhookHandler,
                @inject(IUpdateCCFundMoveStatusWebhookHandlerId) private updateCCFundMoveStatusWebhookHandler: IUpdateCCFundMoveStatusWebhookHandler,
                @inject(IUpdateTradeStatusWebhookHandlerId) private updateTradeStatusWebhookHandler: IUpdateTradeStatusWebhookHandler
    ) {
    }

    createHandlerFromTopic(webhookType) {
        switch (webhookType) {
            case NorthCapitalWebhookType.UpdateTradeStatus().value():
                return this.updateTradeStatusWebhookHandler;
            case NorthCapitalWebhookType.UpdateAiVerification().value():
                return this.updateAiVerificationWebhookHandler;
            case NorthCapitalWebhookType.CreateParty().value():
                return this.createPartyWebhookHandler;
            case NorthCapitalWebhookType.CreateAccount().value():
                return this.createAccountWebhookHandler;
            case NorthCapitalWebhookType.CreateTrade().value():
                return this.createTradeWebhookHandler;
            case NorthCapitalWebhookType.UpdateCCFundMoveStatus().value():
                return this.updateCCFundMoveStatusWebhookHandler;
            case NorthCapitalWebhookType.UpdateBankFundMoveStatus().value():
                return this.updateBankFundMoveStatusWebhookHandler;
        }
    }
}

export default NorthCapitalEventHandlerFactory;
