export const INorthCapitalEventHandlerFactoryId = Symbol.for("INorthCapitalEventHandlerFactory")

export interface INorthCapitalEventHandlerFactory {
    createHandlerFromTopic(webhookType: any): any
}
