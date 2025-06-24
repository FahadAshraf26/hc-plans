import {UseCase} from "@application/BaseInterface/UseCase";

export const IUpdateTradeStatusWebhookHandlerId = Symbol.for("IUpdateTradeStatusWebhookHandler")

export interface IUpdateTradeStatusWebhookHandler extends UseCase<any, boolean> {
}
