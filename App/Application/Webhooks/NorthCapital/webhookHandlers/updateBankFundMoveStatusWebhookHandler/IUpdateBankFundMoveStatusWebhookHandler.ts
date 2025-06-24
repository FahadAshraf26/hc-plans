import {UseCase} from "@application/BaseInterface/UseCase";

export const IUpdateBankFundMoveStatusWebhookHandlerId = Symbol.for("IUpdateBankFundMoveStatusWebhookHandler")

export interface IUpdateBankFundMoveStatusWebhookHandler extends UseCase<any, any> {
}
