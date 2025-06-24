import ReconfirmOfferingChangeDTO from '@application/CampaignOfferingChange/ReconfirmOfferingChangeDTO';
import HttpException from '@infrastructure/Errors/HttpException';
import GetCampaignFundDTO from '../CampaignFund/GetCampaignFundDTO';
import CampaignOfferingChange from '@domain/Core/CampaignOfferingChange/CampaignOfferingChange';
import emailTemplates from '@domain/Utils/EmailTemplates';
const { campaignTermsChangedTemplate, ReconfirmOfferingChangesTemplate } = emailTemplates;
import mailService from '@infrastructure/Service/MailService';
import email from '@infrastructure/Config/email';
import CampaignFundMap from '@domain/Core/CampaignFunds/CampaignFundMap';
import TriggerOfferingChangesDTO from '@application/Campaign/TriggerOfferingChangesDTO';
import { ICampaignOfferingChangeService } from '@application/CampaignOfferingChange/ICampaignOfferingChangeService';
import { inject, injectable } from 'inversify';
import {
  ICampaignFundService,
  ICampaignFundServiceId,
} from '@application/CampaignFund/ICampaignFundService';
import {
  ICampaignOfferingChangeRepository,
  ICampaignOfferingChangeRepositoryId,
} from '@domain/Core/CampaignOfferingChange/ICampaignOfferingChangeRepository';
const { SendHtmlEmail } = mailService;

@injectable()
class CampaignOfferingChangeService implements ICampaignOfferingChangeService {
  constructor(
    @inject(ICampaignFundServiceId) private campaignFundService: ICampaignFundService,
    @inject(ICampaignOfferingChangeRepositoryId)
    private campaignOfferingChangeRepository: ICampaignOfferingChangeRepository,
  ) {}

  /**
   * It will update the offering change to true
   * @param {*} reconfirmOfferingChangeDTO
   */
  async reconfirmCampaignOfferingChange(
    reconfirmOfferingChangeDTO: ReconfirmOfferingChangeDTO,
  ) {
    const offeringChange = await this.campaignOfferingChangeRepository.fetchById(
      reconfirmOfferingChangeDTO.getcampaignOfferingChangeId(),
    );
    if (!offeringChange) {
      throw new HttpException(404, 'Offering change does not exist');
    }
    offeringChange.reconfirmed = true;
    await this.campaignOfferingChangeRepository.update(offeringChange);
    return ReconfirmOfferingChangesTemplate;
  }

  /**
   * It will trigger offering changes for campaign
   * @param {*} triggerOfferingChangesDTO
   */
  async triggerOfferingChanges(triggerOfferingChangesDTO: TriggerOfferingChangesDTO) {
    const input = new GetCampaignFundDTO(
      triggerOfferingChangesDTO.getCampaignId(),
      1,
      9999,
      'false',
      '',
    );
    const response = await this.campaignFundService.getCampaignFund(input);
    response.data = response.data.map((r) => CampaignFundMap.toDTO(r));
    let investorIds = [],
      emails = [],
      offeringChangeRecords = [];
    for (const campaignFund of response.data) {
      if (investorIds.indexOf(campaignFund.investorId) === -1) {
        const offeringChangeObject = CampaignOfferingChange.createFromDetail(
          campaignFund.CampaignId(),
          campaignFund.investorId,
        );
        const reconfirmUrl = email.RECONFIRM_OFFERING_CHANGE_URL.replace(
          ':campaignOfferingChangeId',
          offeringChangeObject.campaignOfferingChangeId,
        );
        const html = campaignTermsChangedTemplate
          .replace('{@FIRST_NAME}', campaignFund.investor.user.firstName)
          .replace('{@CAMPAIGN_NAME}', campaignFund.campaign.campaignName)
          .replace('{@CAMPAIGN_NAME}', campaignFund.campaign.campaignName)
          .replace('{@AMOUNT}', campaignFund.Amount())
          .replace('{@OFFER_RECONFIRM_LINK}', reconfirmUrl);

        investorIds.push(campaignFund.investorId);
        offeringChangeRecords.push(offeringChangeObject);
        emails.push(
          SendHtmlEmail(campaignFund.investor.user.email, 'Reconfirm Investment', html),
        );
      }
    }
    await this.campaignOfferingChangeRepository.addBulk(offeringChangeRecords);
    return await Promise.allSettled(emails);
  }
}

export default CampaignOfferingChangeService;
