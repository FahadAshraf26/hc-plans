import {UseCase} from "@application/BaseInterface/UseCase";

export const ICreatePartyWebhookHandlerId = Symbol.for("ICreatePartyWebhookHandler")

export interface ICreatePartyWebhookHandler extends UseCase<any, boolean> {
}
