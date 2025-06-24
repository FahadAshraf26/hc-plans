import NorthCapitalClient from './NorthCapitalClient';
import NorthCapitalService from './NorthCapitalService';
import USAEpayClient from './USAEpayClient';
import USAEPayService from './USAEPayService';

const northCapitalClient = new NorthCapitalClient();
const northCapitalService = new NorthCapitalService(northCapitalClient);

const usaepayClient = new USAEpayClient();
const usaepayService = new USAEPayService(usaepayClient);

export { northCapitalService, usaepayService };
