import {UseCase} from "@application/BaseInterface/UseCase";

export const IUpdateCCFundMoveStatusWebhookHandlerId = Symbol.for("IUpdateCCFundMoveStatusWebhookHandler")

export interface IUpdateCCFundMoveStatusWebhookHandler extends UseCase<any, any> {
}
