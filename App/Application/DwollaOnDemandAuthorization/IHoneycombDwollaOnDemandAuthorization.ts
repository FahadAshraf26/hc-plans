export const IHoneycombDwollaOnDemandAuthorizationId = Symbol.for(
  'IHoneycombDwollaOnDemandAuthorization',
);

export interface IHoneycombDwollaOnDemandAuthorization {
  getOnDemandAuthorization(): Promise<any>;
}
