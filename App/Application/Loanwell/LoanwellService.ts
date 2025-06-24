import { inject, injectable } from 'inversify';
import { ILoanwellSerivce } from './ILoanwellService';
import {
  ILoanwellRepository,
  ILoanwellRepositoryId,
} from '@domain/Core/Loanwell/ILoanwellRepository';
import CreateLoanwellDTO from './CreateLoanwellDTO';
import async from 'async';
import fs from 'fs';
import path from 'path';
import { transformedCSV } from '@infrastructure/Utils/transformedCSV';
import importOwners from './Utils/importOwners';
import ImportIssuer from './Utils/ImportIssuer';
import ImportCampaign from './Utils/ImportCampaign';
import Loanwell from '@domain/Core/Loanwell/Loanwell';
import logger from '@infrastructure/Logger/logger';
import FetchLoanwellDTO from './FetchLoanwellDTO';
import {
  ISlackService,
  ISlackServiceId,
} from '@infrastructure/Service/Slack/ISlackService';
import {
  ILoanwellInfraService,
  ILoanwellInfraServiceId,
} from '@infrastructure/Service/Loanwell/ILoanwellInfraService';
import config from '@infrastructure/Config';
import ImportApiLoanwellDataDTO from './ImportApiLoanwellDataDTO';
import { IUserRepository, IUserRepositoryId } from '@domain/Core/User/IUserRepository';
import moment from 'moment';
import { IOwnerDao, IOwnerDaoId } from '@domain/Core/Owner/IOwnerDao';
import Owner from '@domain/Core/Owner/Owner';
import User from '@domain/Core/User/User';
import {
  IIssuerRepository,
  IIssuerRepositoryId,
} from '@domain/Core/Issuer/IIssuerRepository';
import Issuer from '@domain/Core/Issuer/Issuer';
import {
  IIssuerOwnerDAO,
  IIssuerOwnerDAOId,
} from '@domain/Core/IssuerOwner/IIssuerOwnerDAO';
import IssuerOwner from '@domain/Core/IssuerOwner/IssuerOwner';
import {
  IEmployeeLogRepository,
  IEmployeeLogRepositoryId,
} from '@domain/Core/EmployeeLog/IEmployeeLogRepository';
import EmployeeLog from '@domain/Core/EmployeeLog/EmployeeLog';
import {
  ICampaignRepository,
  ICampaignRepositoryId,
} from '@domain/Core/Campaign/ICampaignRepository';
import Campaign from '@domain/Core/Campaign/Campaign';
import {
  ICampaignRoughBudgetRepository,
  ICampaignRoughBudgetRepositoryId,
} from '@domain/Core/CampaignRoughBudget/ICampaignRoughBudgetRepository';
import CampaignRoughBudget from '@domain/Core/CampaignRoughBudget/CampaignRoughBudget';
import {
  ICampaignInfoRepository,
  ICampaignInfoRepositoryId,
} from '@domain/Core/CampaignInfo/ICampaignInfoRepository';
import CampaignInfo from '@domain/Core/CampaignInfo/CampaignInfo';
import {
  ICampaignOwnerStoryRepository,
  ICampaignOwnerStoryRepositoryId,
} from '@domain/Core/CampaignOwnerStory/ICampaignOwnerStoryRepository';
import CampaignOwnerStory from '@domain/Core/CampaignOwnerStory/CampaignOwnerStory';
import {
  ICampaignPLRepository,
  ICampaignPLRepositoryId,
} from '@domain/Core/CampaignPL/ICampaignPLRepository';
import CampaignPL from '@domain/Core/CampaignPL/CampaignPL';
import appendPlusOneToEmail from './Utils/appendPlusOneToEmail';
import TagService from '@application/Tag/TagService';
import { ICampaignTagService, ICampaignTagServiceId } from '@application/CampaignTag/ICamaignTagService';
const { slackConfig } = config;
import CreateCampaignTagDTO from '@application/CampaignTag/CreateCampaignTagDTO';
import { ITagRepository, ITagRepositoryId } from '@domain/Core/Tag/ITagRepository';
import Investor from '@domain/Core/Investor/Investor';
import { InvestorAccreditationStatus } from '@domain/Core/ValueObjects/InvestorAccreditationStatus';
import { IInvestorDao, IInvestorDaoId } from '@domain/Core/Investor/IInvestorDao';
import parseAddressDetails from './Utils/parseAddressDetails';
import { CampaignEscrow } from '@domain/Core/ValueObjects/CampaignEscrow';
import { IGoogleMapsService, IGoogleMapsServiceId } from '@infrastructure/Service/googleMapsService/IGoogleMapsService';
import { LOANWELL_TAGS } from './Utils/loanwellConstants';


@injectable()
class LoanwellService implements ILoanwellSerivce {
  constructor(
    @inject(ILoanwellRepositoryId) private loanwellRepository: ILoanwellRepository,
    @inject(ISlackServiceId) private slackService: ISlackService,
    @inject(ILoanwellInfraServiceId) private loanwellInfraService: ILoanwellInfraService,
    @inject(IUserRepositoryId) private userRepository: IUserRepository,
    @inject(IOwnerDaoId) private ownerDao: IOwnerDao,
    @inject(IInvestorDaoId) private investorDao: IInvestorDao,
    @inject(IIssuerRepositoryId) private issuerRepository: IIssuerRepository,
    @inject(IIssuerOwnerDAOId) private issuerOwnerDao: IIssuerOwnerDAO,
    @inject(IEmployeeLogRepositoryId)
    private employeeLogRepository: IEmployeeLogRepository,
    @inject(ICampaignRepositoryId) private campaignRepository: ICampaignRepository,
    @inject(ICampaignRoughBudgetRepositoryId)
    private campaignRoughBudgetRepository: ICampaignRoughBudgetRepository,
    @inject(ICampaignInfoRepositoryId)
    private campaignInfoRepository: ICampaignInfoRepository,
    @inject(ICampaignOwnerStoryRepositoryId)
    private campaignOwnerStoryRepository: ICampaignOwnerStoryRepository,
    @inject(ICampaignPLRepositoryId) private campaignPLRepository: ICampaignPLRepository,
    @inject(TagService)
    private tagService: TagService,
    @inject(ITagRepositoryId)
    private tagRepository: ITagRepository,
    @inject(ICampaignTagServiceId)
    private campaignTagService: ICampaignTagService,
    @inject(IGoogleMapsServiceId)
    private googleMapService: IGoogleMapsService,
  ) { }

  async parseCsv(file) {
    const csvStream = fs.readFileSync(
      path.join(__dirname, '../../../Storage', file.filename),
      'utf-8',
    );
    if (csvStream) {
      fs.unlink(path.resolve(__dirname, `../../../Storage/${file.filename}`), (err) => {
        logger.error(err);
      });
    }
    return transformedCSV(csvStream);
  }

  async addLoanwellImport(createLoanwellDTO: CreateLoanwellDTO) {
    const loanwellfiles = createLoanwellDTO.getFiles();
    const importedBy = createLoanwellDTO.getAdminUser();
    await async.eachSeries(loanwellfiles, async (loanwellFile) => {
      try {
        const response: any = await this.parseCsv(loanwellFile);
        await importOwners.execute(response);
        await ImportIssuer.execute(response);
        await ImportCampaign.execute(response);

        const loanwell = Loanwell.createFromDetail({
          name: loanwellFile.originalname,
          importedBy,
        });

        await this.loanwellRepository.add(loanwell);
        this.slackService.publishMessage({
          message: `Loanwell Import are done *${importedBy}*
              *. ${loanwellFile.originalname}*
              `,
          slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
        });
      } catch (err) {
        this.slackService.publishMessage({
          message: `Error occured in Loanwell Import. *${importedBy}*
              *. ${loanwellFile.originalname}*. ${err.message}`,
          slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
        });
      }
    });
  }

  async fetchLoanwellBusinessNames(filterImported: string): Promise<any> {
    let businessNames;
    businessNames = await this.loanwellInfraService.fetchBusinessNames();

    if (filterImported === 'false') {
      const importedCampaigns = await this.campaignRepository.fetchAllCampaignNames();
      businessNames = businessNames.filter(campaign => !importedCampaigns.includes(campaign.campaignName));
    }

    return businessNames
  }

  async importApiLoanwellData(
    importApiLoanwellDataDTO: ImportApiLoanwellDataDTO,
  ): Promise<string[]> {
    const campaignNames: string[] = importApiLoanwellDataDTO.getCampaignName();
    const logs: string[] = [];

    const response = await this.loanwellInfraService.fetchData({
      campaignName: campaignNames,
    })

    if (!response.data[0]) {
      logs.push(`Bad response from Loanwell\n`)
      this.slackService.publishMessage({
        message: `Error occured in Loanwell Import. ${logs[logs.length - 1]}`,
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
      logger.error(`${logs[logs.length - 1]}`);
      return logs;
    }

    for (let i = 0; i < response.data.length; i++) {
      if (!response.data[i].companyemailaddress) {
        logs.push(`Company email doesn't exist for campaign: ${campaignNames[i]} in loanwell data\n`)
        this.slackService.publishMessage({
          message: `Error occured in Loanwell Import. ${logs[logs.length - 1]}`,
          slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
        });
        logger.error(`${logs[logs.length - 1]}`);
      } else {
        await this.importOwners(response.data[i]);
        logs.push(`Loanwell data for campaign: ${campaignNames[i]}, will be imported shortly\n`)
      }
    }

    return logs;
  }

  async fetchLoanwellData(fetchloanwellDTO: FetchLoanwellDTO) {
    const result = await this.loanwellRepository.fetchAll({
      paginationOptions: fetchloanwellDTO.getPaginationOptions(),
    });

    return result.getPaginatedData();
  }

  async importOwners(obj: any) {
    try {
      if (obj.owners) {
        const owners = JSON.parse(obj.owners);

        const firstKey = Object.keys(owners)[0];
        const ownerInfo = owners[firstKey];

        let ownerId;
        const dob = ownerInfo.dob
          ? `'${moment(ownerInfo.dob, 'MM/DD/YYYY').format('YYYY-MM-DD')}'`
          : null;
        const beneficialOwner =
          obj.ownershippercentage && obj.ownershippercentage > 25 ? true : false;

        const addressDetails = parseAddressDetails(obj.borroweraddresscitystatezip.split(','));
        const ownerEmail = obj.personalemailaddress ? obj.personalemailaddress : appendPlusOneToEmail(obj.companyemailaddress).toLowerCase();

        const user = await this.userRepository.fetchByEmail(ownerEmail, false);
        if (user) {
          user.firstName = ownerInfo.firstName;
          user.lastName = ownerInfo.lastName;
          user.userName = obj.borrowerfullname;
          user.dob = new Date(dob);
          user.ssn = ownerInfo.ssn;
          user.address = addressDetails.address;
          user.apartment = addressDetails.apartment;
          user.city = addressDetails.city;
          user.state = addressDetails.state;
          user.zipCode = addressDetails.zipCode;
          user.phoneNumber = obj.borrowerphonenumber;
          if (user.investor) {
            user.investor.netWorth = user.investor.netWorth ? user.investor.netWorth : 0
            user.investor.annualIncome = user.investor.annualIncome ? user.investor.netWorth : 0
          }

          await this.userRepository.update(user);
          const owner = await this.ownerDao.fetchByUserId(user.userId);
          if (owner) {
            const ownerToUpdate = Owner.createFromObject({
              ownerId: owner.ownerId,
              title: obj.borrowerfullname,
              subTitle: obj.signeronetitle,
              description: ownerInfo.bio ? ownerInfo.bio : '',
              primaryOwner: true,
              beneficialOwner: beneficialOwner,
              businessOwner: false,
            });
            ownerToUpdate.setUserId(user.userId);
            ownerId = ownerToUpdate.ownerId;
            await this.ownerDao.update(ownerToUpdate);
          } else {
            const ownerToCreate = Owner.createFromDetail(
              user.userId,
              obj.borrowerfullname,
              obj.signeronetitle,
              ownerInfo.bio ? ownerInfo.bio : '',
              true,
              beneficialOwner,
              false,
            );
            ownerId = ownerToCreate.ownerId;
            await this.ownerDao.add(ownerToCreate);
          }
        } else {
          const userToCreate = User.createFromDetail(
            ownerInfo.firstName,
            ownerInfo.lastName,
            obj.borrowerfullname,
            ownerEmail,
            addressDetails.address,
            addressDetails.apartment,
            addressDetails.city,
            addressDetails.state,
            addressDetails.zipCode,
            new Date(dob),
            obj.borrowerphonenumber,
            null,
            ownerInfo.ssn,
            '0',
            'Pass',
            null,
            'Verified',
            null,
            null,
            true,
            null,
            false,
            false,
            false,
            false,
            null,
            null,
            null,
            null,
            null,
            null,
          );
          await this.userRepository.add(userToCreate);
          const ownerToCreate = Owner.createFromDetail(
            userToCreate.userId,
            obj.borrowerfullname,
            obj.signeronetitle,
            ownerInfo.bio ? ownerInfo.bio : '',
            true,
            beneficialOwner,
            false,
          );
          ownerId = ownerToCreate.ownerId;
          await this.ownerDao.add(ownerToCreate);

          const investorToCreate = Investor.createFromDetail(
            userToCreate.userId,
            0,
            0,
            false,
            2500,
            InvestorAccreditationStatus.NOT_ACCREDITED,
            2500,
            null,
          )
          const investorId = investorToCreate.getInvestorId();
          await this.investorDao.add(investorToCreate);
        }
        await this.importIssuer(obj, ownerId);
      }
    } catch (e) {
      this.slackService.publishMessage({
        message: `Error occured in Loanwell Import. *${obj.legalnameofbusiness}*\n ${e.message}`,
        slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
      });
      logger.error(e);
      throw new Error(`Error while getting Loanwell response: ${e.message}`);
    }
  }

  async importIssuer(obj, ownerId: string) {
    const issuer = await this.issuerRepository.fetchByName(obj.legalnameofbusiness);

    let issuerId = issuer.issuerId;
    if (!issuer) {
      const addressDetails = parseAddressDetails(obj.companymailingaddresscitystatezip.split(','));
      const companyWebsite = obj.companywebsite.startsWith('https://') ? obj.companywebsite : `https://${obj.companywebsite}`
      const address = `${addressDetails.apartment ? `${addressDetails.address}, ${addressDetails.apartment}` : addressDetails.address}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.zipCode}`;
      let latitude = null;
      let longitude = null;

      if(address){
        const mapsResponse = await this.googleMapService.textSearch({address});
        if(mapsResponse.status === "OK"){
          const {lat, lng} = mapsResponse.results[0].geometry.location
          latitude = `${lat}`;
          longitude = `${lng}`;
        };
      };

      const issuerToCreate = Issuer.createFromDetail({
        email: obj.companyemailaddress,
        issuerName: obj.legalnameofbusiness,
        previousName: null,
        EIN: obj.companytaxidentificationnumbertin,
        businessType: obj.pleaseselecttheindustrythatbestrepresentsyourprimarylin,
        legalEntityType:
          obj.businesslegalstructure === 'Limited Liability Co'
            ? 'llc'
            : obj.businesslegalstructure,
        physicalAddress: addressDetails.apartment ? `${addressDetails.address}, ${addressDetails.apartment}` : addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state ? addressDetails.state : '',
        zipCode: addressDetails.zipCode ? addressDetails.zipCode : '',
        latitude: latitude,
        longitude: longitude,
        phoneNumber: obj.companyphonenumber,
        website: companyWebsite,
        facebook: null,
        linkedIn: null,
        instagram: null,
        twitter: null,
        pinterest: null,
        reddit: null,
        country: 'United States',
      });
      issuerToCreate.setEmployeeCount(
        obj.howmanyemployeesworkforyourcompanyincludingyourself,
      );

      await this.issuerRepository.add(issuerToCreate);
      issuerId = issuerToCreate.issuerId;

      const employeeLogToCreate = EmployeeLog.createFromDetail({
        issuerId: issuerId,
        employeeCount: obj.howmanyemployeesworkforyourcompanyincludingyourself,
        updatedEmployeeCount: obj.howmanyemployeesworkforyourcompanyincludingyourself,
      });

      const issuerOwnerToCreate = IssuerOwner.createFromDetail(ownerId, issuerId);
      await this.issuerOwnerDao.add(issuerOwnerToCreate);
      await this.employeeLogRepository.add(employeeLogToCreate);
    } else {
      issuer.setEmployeeCount(obj.howmanyemployeesworkforyourcompanyincludingyourself)
    }
    await this.importCampaign(obj, issuerId);
  }

  async importCampaign(obj: any, issuerId: string) {
    const campaigns = await this.campaignRepository.fetchAllByIssuerId(issuerId);

    if (campaigns.length === 0) {
      const startDate = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
      const endDate = `${moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss')}`;
      const diff =
        startDate && endDate ? moment(endDate).diff(moment(startDate), 'days') : 0;
      const repaymentStartDate = `'${moment().add(60, 'days').format('YYYY-MM-DD')}'`;

      const campaignToCreate = Campaign.createFromDetail({
        campaignName: obj.dbaortradenameifapplicable,
        issuerId: issuerId,
        campaignExpirationDate: endDate,
        campaignStage: 'Onboarding',
        campaignTargetAmount: parseFloat(obj.maxamount),
        campaignMinimumAmount: parseFloat(obj.minamount),
        investmentType: 'Debt',
        overSubscriptionAccepted: null,
        typeOfSecurityOffered: 'RegCF',
        useOfProceeds: obj.useoffundsdescription,
        salesLead: null,
        summary: `<p>${obj.companyoverview}</p>`,
        demoLink: null,
        isLocked: null,
        campaignStartDate: startDate,
        campaignDuration: diff,
        earningProcess:
          'A $1,000 investment earns $XXX ($1,000 in principal + $XXX in interest) after fees by the end of the investment term, if the business pays as agreed',
        financialProjectionsDescription: '',
        howHoneycombIsCompensated: `Honeycomb charges ${obj.legalnameofbusiness} a $449 posting fee and an 8.5% loan origination fee. Additionally, to cover expenses associated with each investment, Honeycomb charges a one-time fee on each transaction, by type: ACH: 3% investment fee capped at $50; Credit card: 4.50% (no cap); Hybrid ACH + Honeycomb Wallet: 2.00%, capped at $30, Honeycomb Wallet only: 0.00% fee.`,
        campaignDocumentUrl: `https://www.sec.gov/edgar/search/`,
        repaymentSchedule:
          'Business makes monthly repayments, disbursed to investors quarterly',
        collateral: obj.collateraldescription,
        annualInterestRate: obj.annualinterestrate,
        maturityDate: null,
        repaymentStartDate: repaymentStartDate,
        loanDuration: obj.amortizationterm ? obj.amortizationterm / 12 : 0,
        isChargeFee: false,
        interestOnlyLoanDuration: null,
        campaignEndTime: '23:59:59',
        campaignTimezone: 'America/New_York',
        blanketLien: false,
        equipmentLien: false,
        isPersonalGuarantyFilled: false,
        personalGuaranty: null,
        shareValue: null,
        escrowType: CampaignEscrow.THREAD_BANK,
        isChargeStripe: true,
        isCampaignAddress: false,
      });

      await this.campaignRepository.add(campaignToCreate);
      const tagInDescription = obj.whichofthefollowingbestdescribesyourbusiness;
      const tagInSelectal = JSON.parse(obj.wouldyoudescribeyourbusinessasanyofthefollowingselectal);
      if (tagInDescription) {
        const tagId = LOANWELL_TAGS[tagInDescription];
        if (tagId) {
          const input = new CreateCampaignTagDTO([tagId], campaignToCreate.CampaignId());
          await this.campaignTagService.createCampaignTag(input);
        }
      };

      if (tagInSelectal && Array.isArray(tagInSelectal)) {
        tagInSelectal.forEach(async (tag) => {
          const tagId = LOANWELL_TAGS[tag];
          if (tagId) {
            const input = new CreateCampaignTagDTO([tagId], campaignToCreate.CampaignId());
            await this.campaignTagService.createCampaignTag(input);
          }
        })
      }

      const useOfFundsJson = JSON.parse(obj.useoffunds);
      const totalAmount = useOfFundsJson.reduce((a, b) => {
        return a + b.amount;
      }, 0);
      const useOfFunds = [];
      useOfFundsJson.forEach((item: any) => {
        useOfFunds.push({
          name: `${item.item}`,
          color: '#377BF5',
          maxValue: Math.round((item.amount / totalAmount) * 100),
          minValue: Math.round((item.amount / totalAmount) * 100),
        });
      });
      const roughBudgetToCreate = CampaignRoughBudget.createFromDetail(
        { roughBudget: useOfFunds },
        campaignToCreate.campaignId,
      );
      await this.campaignRoughBudgetRepository.add(roughBudgetToCreate);

      const campaignInfo = await this.campaignInfoRepository.fetchByCampaign(
        campaignToCreate.CampaignId(),
        false,
      );

      let milestones = JSON.stringify(['N/A']);
      if (obj.businessawards) {
        milestones = JSON.stringify(obj.businessawards.split('\n').filter(award => award.trim() !== ""));
      }

      if (!campaignInfo) {
        const campaignInfoToCreate = CampaignInfo.createFromDetail(
          JSON.stringify(['N/A']),
          'N/A',
          campaignToCreate.campaignId,
          milestones,
          '<p>There are no investment fees on this investment offering until [DATE] at 5 PM ET when you invest with your bank account or Honeycomb Wallet. Hurry, this offer ends soon!</p>',
          'N/A',
          null,
          false,
          'No Investment Fees for 24 hours',
        );
        await this.campaignInfoRepository.add(campaignInfoToCreate);
      } else {
        campaignInfo.setInvestorPitch('<p>There are no investment fees on this investment offering until XXX at 5 PM ET when you invest with your bank account or Honeycomb Wallet. Hurry, this offer ends soon!</p>')
        campaignInfo.setInvestorPitchTitle('No Investment Fees for 24 hours');
        await this.campaignInfoRepository.add(campaignInfo);
      }

      const description = `<h2><u><b>History</b></u></h2><p>${obj.companyhistory}</p><br /><h2><u><b>Future</b></u></h2><p>${obj.futureoutlook}</p>`;
      const campaignOwnerStoryToCreate = CampaignOwnerStory.createFromDetail(
        campaignToCreate.campaignId,
        campaignToCreate.campaignName,
        description,
        null,
      );
      await this.campaignOwnerStoryRepository.add(campaignOwnerStoryToCreate);

      let pl = [];
      for (let i = 0; i < 5; i++) {
        pl.push({
          year: moment().add(i, 'year').format('YYYY'),
          expense: '1',
          revenue: '1',
        });
      }
      const campaignPLToCreate = CampaignPL.createFromDetail(
        pl,
        campaignToCreate.campaignId,
      );

      await this.campaignPLRepository.add(campaignPLToCreate);
    }
    this.slackService.publishMessage({
      message: `Loanwell Imports are completed for *${obj.legalnameofbusiness}*`,
      slackChannelId: slackConfig.EMPLOYEE_ACTIVITY.ID,
    });
  }
}

export default LoanwellService;