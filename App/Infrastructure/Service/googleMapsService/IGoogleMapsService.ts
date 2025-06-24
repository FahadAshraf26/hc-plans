export const IGoogleMapsServiceId = Symbol.for('IGoogleMapsService');

export interface IGoogleMapsService {
  textSearch(params: {address: string}): Promise<any>;
}
