// import { moneyMadeConfig } from '../../Config';
// import * as crypto from 'crypto';

// class MoneyMadeService {
//   moneymade: any;
//   moneyMadeClient: any;

//   constructor(moneymade, moneyMadeClient) {
//     this.moneymade = moneymade;
//     this.moneyMadeClient = moneyMadeClient;
//   }

//   validatingHash(payload, signature) {
//     const hmac = crypto.createHmac('sha256', moneyMadeConfig.MONEYMADE_PRIVATE_KEY);
//     const data = hmac.update(
//       moneyMadeConfig.MONEYMADE_PUBLIC_KEY +
//         payload +
//         moneyMadeConfig.MONEYMADE_PUBLIC_KEY,
//     );
//     const gen_hmac = data.digest('hex');

//     if (gen_hmac !== signature) {
//       return false;
//     }

//     return true;
//   }

//   decodePayload(payload) {
//     return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
//   }

//   setRequestHeaders(body) {
//     return {
//       headers: {
//         'api-key': moneyMadeConfig.MONEYMADE_PUBLIC_KEY,
//         'request-signature': this.generateSignaturesUsingSDK(body),
//       },
//     };
//   }

//   generateSignature(body) {
//     const base64 = new Buffer(JSON.stringify(body)).toString('base64');
//     const hmac = crypto.createHmac('sha256', moneyMadeConfig.MONEYMADE_PRIVATE_KEY);
//     const data = hmac.update(
//       moneyMadeConfig.MONEYMADE_PUBLIC_KEY +
//         base64 +
//         moneyMadeConfig.MONEYMADE_PUBLIC_KEY,
//     );

//     return data.digest('hex');
//   }

//   generateSignaturesUsingSDK(body) {
//     return this.moneymade.makeBodySignature(body);
//   }

//   getMoneyMadeInstance() {
//     return this.moneymade;
//   }

//   async finishOauth(accessToken, userId, oauthSignature, oauthPayload) {
//     try {
//       const res = await this.moneymade.finishOauth({
//         accessToken,
//         userId,
//         oauthSignature,
//         oauthPayload,
//       });

//       return res;
//     } catch (err) {
//       throw err;
//     }
//   }

//   /**
//    * data will be an array of object
//    * @param data
//    * @returns {Promise<*>}
//    */
//   async postBalance(data) {
//     try {
//       const res = await this.moneyMadeClient.post(
//         'balance',
//         data,
//         this.setRequestHeaders(data),
//       );

//       return res;
//     } catch (err) {
//       throw err;
//     }
//   }

//   /**
//    * data will be an array of object
//    * @param data
//    * @returns {Promise<*>}
//    */
//   async postTransactions(data) {
//     try {
//       const res = await this.moneyMadeClient.post(
//         'transactions',
//         data,
//         this.setRequestHeaders(data),
//       );
//       return res;
//     } catch (err) {
//       throw err;
//     }
//   }
// }

// export default MoneyMadeService;
