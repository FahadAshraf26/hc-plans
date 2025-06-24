import {UseCase} from "@application/BaseInterface/UseCase";

export const ICreateTradeWebhookHandlerId = Symbol.for("ICreateTradeWebhookHandler");

export interface ICreateTradeWebhookHandler extends UseCase<any, boolean> {
}
