const axios = require('axios').default;
import config from '../../Config';
import FormData from 'form-data';
const { northCapital } = config;

class NorthCapitalClient {
  northCapitalClient: any;
  VERBS = {
    PUT: 'PUT',
    POST: 'POST',
  };

  constructor() {
    this.northCapitalClient = axios.create({
      baseURL: northCapital.baseURL,
    });
  }

  async sendRequest({ httpVerb, url, data }) {
    try {
      if (!this.validateHttpVerb(httpVerb)) {
        throw Error('Invalid http verb');
      }

      data = this.transformRequestData(data);

      const config = {
        headers: data instanceof FormData ? data.getHeaders() : northCapital.headers,
      };

      const res = await this.northCapitalClient[httpVerb.toLowerCase()](
        url,
        data,
        config,
      );
      return res.data;
    } catch (err) {
      const toThrow = err.response
        ? err.response.data
          ? err.response.data['Error(s)']
            ? err.response.data['Error(s)'].replace('<br />','')
            : err.response.data
          : err.response
        : err;
      throw Error(toThrow);
    }
  }

  async sendLinkedRequest({ httpVerb, url, data }) {
    try {
      if (!this.validateHttpVerb(httpVerb)) {
        throw Error('Invalid http verb');
      }

      data = this.transformRequestData(data);
      const config = {
        headers: data instanceof FormData ? data.getHeaders() : northCapital.headers,
      };
      const fullURL = `${northCapital.newBaseURL}${url}`;
      const res = await axios[httpVerb.toLowerCase()](fullURL, data, config);
      return res.data.creditcardDetails;
    } catch (err) {
      const toThrow = err.response
        ? err.response.data
          ? err.response.data.statusDesc
            ? err.response.data.statusDesc
            : err.response.data
          : err.response
        : err;
      throw Error(toThrow);
    }
  }

  validateHttpVerb(httpVerb) {
    if (!Object.values(this.VERBS).includes(httpVerb)) {
      return false;
    }

    return true;
  }

  transformRequestData(data) {
    if (!data) {
      return {};
    }

    if (data instanceof FormData) {
      return data;
    }

    return {
      ...data,
      clientID: northCapital.clientID,
      developerAPIKey: northCapital.developerAPIKey,
    };
  }
}

export default NorthCapitalClient;
