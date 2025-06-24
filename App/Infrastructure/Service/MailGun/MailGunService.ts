import MailGun from 'mailgun-js';
import config from '../../Config';
const { emailConfig } = config;
const email = emailConfig;

class MailGunService {
  client: any;
  domain: string;

  constructor() {
    this.client = MailGun({
      apiKey: email.mailGun.apiKey,
      domain: email.mailGun.domain,
    });
    this.domain = email.mailGun.domain;
  }

  async getUnsubscribersList() {
    try {
      const response = await this.client.get(`/${this.domain}/unsubscribes`);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async unsubscribe(email) {
    try {
      const response = await this.client.post(`/${this.domain}/unsubscribes`, {
        address: email,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async subscribe(email) {
    try {
      const response = await this.client.delete(`/${this.domain}/unsubscribes/${email}`);

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default MailGunService;
