import dotenv from 'dotenv';
dotenv.config();
import mailService from '../App/Infrastructure/Service/MailService';
import axios from 'axios';
const { SendHtmlEmail } = mailService;
import EmailTemplates from '@domain/Utils/EmailTemplates';
import container from '@infrastructure/DIContainer/container';
import CampaignFundRepository from '@infrastructure/MySQLRepository/CampaignFundRepository';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';


const campaignFundRepository = container.get<CampaignFundRepository>(
  CampaignFundRepository,
);

const { wefunderInvestmentTemplate } = EmailTemplates;

export const wefunderInvestment =  async () => {
  const campaignFund = await campaignFundRepository.fetchByChargeId(
    'b5b36088-0c41-42fb-bc84-dfcb122f4298',
  );

  // const data = await axios.get(
  //   'https://wefunder.com/api/honeycomb_wefunder?access_token=KSjdYRiJKfgBWj581dC1hRvs',
  // );

  // const campaignFundInput = {
  //   ...campaignFund['_props'],
  //   amount: data.data.current_raised,
  //   investmentPaymentOptionId: null,
  //   campaignFundId: campaignFund.campaignFundId,
  // };

  // await campaignFundRepository.updateWefunder(campaignFundInput);
  // const html = wefunderInvestmentTemplate.replace(
  //   '{@TOTAL_INVESTMENT}',
  //   data.data.current_raised,
  // );
  // await SendHtmlEmail('fahad.ashraf@carbonteq.com', 'Wefunder Investment Raised', html);
};
