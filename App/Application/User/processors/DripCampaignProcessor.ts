import EmailTemplates from '../../../Domain/Utils/EmailTemplates';
import { inject } from 'inversify';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
const {
  WelcomeTOMiventureCommunity,
  HowDoBusinessesGetOnMiventure,
  AskFounderAQuestion,
  SendYourFeedback,
  InvestInFounderThatInspiresYou,
  DiversifyYourPortfolio,

  // sign up , kyc not passed
  WhyWeBuiltMiventure,
  HowDoOpportunitiesGetOnMiventure,
  CheckOutNewFeaturesOnMiventure,

  // sign up and kyc passed
  CongratsOnBecomingEligibleToInvest,
  LifeGetsBusyWeGetIt,
  MiventureWantsToHearFromYou,
} = EmailTemplates;

class DripCampaignProcessor {
  private sendEmail: any;

  constructor(
    sendEmail,
    @inject(IUserRepositoryId) private userRepository?: IUserRepository,
  ) {
    this.sendEmail = sendEmail;
  }

  templates = {
    whyWeBuiltMiventure: {
      template: WhyWeBuiltMiventure,
      subject: 'Why we built Miventure',
    },
    howDoOpportunitiesGetOnMiventure: {
      template: HowDoOpportunitiesGetOnMiventure,
      subject: 'How do Opportunities get on Miventure?',
    },
    checkOutNewFeaturesOnMiventure: {
      template: CheckOutNewFeaturesOnMiventure,
      subject: 'Check out new features on Miventure!',
    },
    WelcomeTOMiventureCommunity: {
      template: WelcomeTOMiventureCommunity,
      subject: 'Welcome to the Miventure Community',
    },
    HowDoBusinessesGetOnMiventure: {
      template: HowDoBusinessesGetOnMiventure,
      subject: 'How do businesses get on Miventure?',
    },
    AskFounderAQuestion: {
      template: AskFounderAQuestion,
      subject: 'Ask a founder a question!',
    },
    SendYourFeedback: {
      template: SendYourFeedback,
      subject: 'Send us your feedback!',
    },
    InvestInFounderThatInspiresYou: {
      template: InvestInFounderThatInspiresYou,
      subject: 'Invest in a founder that inspires you!',
    },
    DiversifyYourPortfolio: {
      template: DiversifyYourPortfolio,
      subject: 'Diversify your portfolio!',
    },
  };

  determineTemplateAndStage(days = 0, template = undefined) {
    switch (days) {
      case -1: // special case to send all users that haven't invested an email
        if (!template) {
          return this.templates[Object.keys(this.templates)[0]];
        }

        return this.templates[template];
      case 2:
        return this.templates['WelcomeTOMiventureCommunity'];
      case 4:
        return this.templates['HowDoBusinessesGetOnMiventure'];
      case 10:
        return this.templates['AskFounderAQuestion'];
      case 15:
        return this.templates['SendYourFeedback'];
      case 20:
        return this.templates['InvestInFounderThatInspiresYou'];
      case 30:
        return this.templates['DiversifyYourPortfolio'];
      default:
        throw Error('invalid number of days');
    }
  }

  kycPassedTemplates = {
    congratsOnBecomingEligibleToInvest: {
      template: CongratsOnBecomingEligibleToInvest,
      subject: 'Congrats on becoming eligible to invest!',
    },
    lifeGetsBusyWeGetIt: {
      template: LifeGetsBusyWeGetIt,
      subject: 'Life gets busy, we get it!',
    },
    miventureWantsToHearFromYou: {
      template: MiventureWantsToHearFromYou,
      subject: 'Miventure wants to hear from you!',
    },
  };

  determineKycPassedTemplateAndSubject(days = 0, template = undefined) {
    switch (days) {
      case -1: // special case to send all users that haven't invested an email
        if (!template) {
          return this.kycPassedTemplates[Object.keys(this.kycPassedTemplates)[0]];
        }

        return this.kycPassedTemplates[template];
      case 2:
        return this.kycPassedTemplates['congratsOnBecomingEligibleToInvest'];
      case 7:
        return this.kycPassedTemplates['lifeGetsBusyWeGetIt'];
      case 10:
        return this.kycPassedTemplates['miventureWantsToHearFromYou'];
      default:
        throw Error('invalid number of days');
    }
  }

  /**
   * sends emails to customers with no investments after sign up
   * @param {{}daysSinceSignedUp: number,template: string,subject:string} options
   */
  async NotifyUsersWithDaysSinceSignup({
    daysSinceSignedUp = 0,
    template,
    subject,
    kycPassed,
  }) {
    if (!daysSinceSignedUp) {
      return;
    }

    if (!template || !subject || typeof kycPassed === 'undefined') {
      throw Error('template and subject are required');
    }

    const users = await this.userRepository.fetchUsersWithNoInvestments(
      daysSinceSignedUp,
      kycPassed,
    );

    const emailPromises = [];
    for (const user of users) {
      const html = template.replace(
        / {@USERNAME}/g,
        user.firstName ? ` ${user.firstName}` : '',
      );
      emailPromises.push(this.sendEmail(user.email, subject, html));
    }

    await Promise.all(emailPromises);
  }
}

export default DripCampaignProcessor;
