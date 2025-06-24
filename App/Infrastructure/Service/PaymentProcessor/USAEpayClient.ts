import config from '@infrastructure/Config';
import axios, { AxiosInstance } from 'axios';
import { injectable } from 'inversify';

const { usaepay } = config;
type sendRequest = {
  httpVerb: string;
  url: string;
  data: object;
  authorizationHeaders: object;
};

@injectable()
class USAEpayClient {
  USAEpayClient: AxiosInstance;
  VERBS = {
    PUT: 'PUT',
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
  };

  constructor() {
    this.USAEpayClient = axios.create({
      baseURL: usaepay.BASE_URL,
    });
  }

  async sendRequest({ httpVerb, url, data, authorizationHeaders }: sendRequest) {
    const methodVerb = httpVerb.toLowerCase();
    try {
      if (!this.validateHttpVerb(httpVerb)) {
        throw Error('Invalid http verb');
      }
      const headerWithAuthorization = {
        ...usaepay.HEADERS,
        Authorization: `Basic ${authorizationHeaders}`,
      };
      const config = {
        headers: headerWithAuthorization,
      };
      const request =
        methodVerb === 'get'
          ? this.USAEpayClient.get
          : methodVerb === 'post'
          ? this.USAEpayClient.post
          : methodVerb === 'put'
          ? this.USAEpayClient.put
          : this.USAEpayClient.delete;
      if (!data) {
        const res = await request(url, config);
        return res.data;
      }
      const res = await request(url, data, config);
      return res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  validateHttpVerb(httpVerb: string) {
    return Object.values(this.VERBS).includes(httpVerb);
  }
}

export default USAEpayClient;
