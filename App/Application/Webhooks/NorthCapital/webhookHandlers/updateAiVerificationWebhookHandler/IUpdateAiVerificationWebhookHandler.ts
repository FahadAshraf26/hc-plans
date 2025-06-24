import {UseCase} from "@application/BaseInterface/UseCase";

export const IUpdateAiVerificationWebhookHandlerId = Symbol.for("IUpdateAiVerificationWebhookHandler");

export interface IUpdateAiVerificationWebhookHandler extends UseCase<any, boolean> {
}
