import axios from 'axios';
import config from '../../Config';
import { IInvestReadyService } from '@infrastructure/Service/InvestReadyService/IInvestReadyService';
import { injectable } from 'inversify';
const { investReady } = config;
const investReadyConfig = investReady;

const investReadyClient = axios.create({
  baseURL: investReadyConfig.API_BASE_URL,
});

@injectable()
class InvestReadyService implements IInvestReadyService {
  async getUserToken(AuthorizationCode) {
    try {
      const userToken = await investReadyClient.post('/oauth/token', {
        code: AuthorizationCode,
        grant_type: 'authorization_code',
        client_id: investReadyConfig.CLIENT_ID,
        client_secret: investReadyConfig.CLIENT_SECRET,
        redirect_uri: investReadyConfig.REDIRECT_URL,
      });

      return {
        token: userToken.data.access_token,
        refreshToken: userToken.data.refresh_token,
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshUserToken(refreshToken) {
    try {
      const userToken = await investReadyClient.post('/oauth/token', {
        grant_type: 'refresh_token',
        client_id: investReadyConfig.CLIENT_ID,
        client_secret: investReadyConfig.CLIENT_SECRET,
        redirect_uri: investReadyConfig.REDIRECT_URL,
        refresh_token: refreshToken,
      });

      return {
        token: userToken.data.access_token,
        refreshToken: userToken.data.refresh_token,
      };
    } catch (err) {
      throw err;
    }
  }

  async getUser(accessToken) {
    try {
      const response = await investReadyClient.post('/api/me.json', {
        access_token: accessToken,
      });

      const {
        person: { hash, email },
        certificates,
      } = response.data.data;

      /**
        {
            userHash,
            email,
            isAccredited
        }
     */
      return {
        userHash: hash,
        email,
        isAccredited:
          certificates.length === 0
            ? false
            : certificates.reduce((result, cert) => {
                return cert.expires_on && new Date(cert.expires_on) > new Date();
              }, false),
        lastExpiry:
          certificates.length === 0
            ? undefined
            : certificates.reduce((result, cert) => {
                const date = new Date(cert.expires_on);
                return cert.expires_on && date > result ? date : result;
              }, new Date()),
        certificates: certificates,
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshTokenAndGetUser(refreshToken: string) {
    try {
      const {
        data: { access_token: token, refresh_token: resRefreshToken },
      } = await investReadyClient.post('/oauth/token', {
        grant_type: 'refresh_token',
        client_id: investReadyConfig.CLIENT_ID,
        client_secret: investReadyConfig.CLIENT_SECRET,
        redirect_uri: investReadyConfig.REDIRECT_URL,
        refresh_token: refreshToken,
      });

      const userData = await this.getUser(token);

      return {
        ...userData,
        token,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
}

export default InvestReadyService;
