import {UseCase} from "@application/BaseInterface/UseCase";

export const ICreateAccountWebhookHandlerId = Symbol.for("ICreateAccountWebhookHandler")

export interface ICreateAccountWebhookHandler extends UseCase<any, boolean> {
}
