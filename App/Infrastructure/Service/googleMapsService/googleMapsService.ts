import { injectable } from 'inversify';
import { IGoogleMapsService } from './IGoogleMapsService';
import { Client } from "@googlemaps/google-maps-services-js";
import Config from '@infrastructure/Config';
const {google} = Config

@injectable()
class GoogleMapsService implements IGoogleMapsService {
  private client;

  constructor() {
    this.client = new Client({});
  }

  async textSearch(params: { address: string }) {
    const response = await this.client.textSearch({
      params: {
        query: params.address,
        key: google.GOOGLE_MAPS_API_KEY,
      }
    });
    return response.data;
  }

}

export default GoogleMapsService;
