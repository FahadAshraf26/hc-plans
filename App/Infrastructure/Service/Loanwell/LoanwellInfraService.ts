import { injectable } from 'inversify';
import qs from 'qs';
import axios, { AxiosInstance } from 'axios';
import { ILoanwellInfraService } from './ILoanwellInfraService';
import Config from '@infrastructure/Config';
import formatCampaignNameWithQuotes from '@infrastructure/Utils/formatCampaignName';


@injectable()
class LoanwellInfraService implements ILoanwellInfraService {
  LoanwellClient: AxiosInstance;
  private headers: any;
  private query: any = {};

  constructor() {
    this.LoanwellClient = axios.create({
      baseURL: 'https://loanwell.metabaseapp.com',
    });
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-API-KEY': Config.loanwell.loanwell.LOANWELL_API_KEY,
    };
  }

  async fetchBusinessNames() {
    try {
      this.query = {
        query:
          '{"type":"native","native":{"query":"SELECT id AS \\"id\\", legalnameofbusiness AS \\"legalnameofbusiness\\", dbaortradenameifapplicable AS \\"campaignName\\" FROM agreement WHERE ( applicationpipelinestatus = \'completed\' ) OR ( applicationpipelinestatus = \'close\' )","template-tags":{}},"database":41,"parameters":[]}',
      };

      let data = qs.stringify(this.query);

      const config = {
        headers: this.headers,
        data: data,
      };
      const request = this.LoanwellClient.post;
      const response = await request(`/api/dataset/json`, data, config);

      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async fetchData(filters: { campaignName?: string[] }) {
    try {
      const campaignName = filters.campaignName;
      this.query = {
        query: `{"type":"native","native":{"query":"SELECT id AS \\"id\\", archived AS \\"archived\\", whatisyourphysicaladdress AS \\"whatisyourphysicaladdress\\", borroweraddresscitystatezip AS \\"borroweraddresscitystatezip\\", borrowercity AS \\"city\\", borrowercitystate AS \\"borrowercitystate\\", borrowercounty AS \\"borrowercounty\\", borrowercountystate AS \\"borrowercountystate\\", whatisyouremailaddress AS \\"whatisyouremailaddress\\", whatisyourfirstname AS \\"whatisyourfirstname\\", borrowerid AS \\"borrowerid\\", whatisyourlastname AS \\"whatisyourlastname\\", borrowerstate AS \\"state\\", borrowerstatus AS \\"borrowerstatus\\", borrowerzipcode AS \\"zipcode\\", datecreated AS \\"datecreated\\", datemodified AS \\"datemodified\\", documentid AS \\"documentid\\", documentidcreationdate AS \\"documentidcreationdate\\", interestrate AS \\"interestrate\\", owneremail AS \\"owneremail\\", ownerid AS \\"ownerid\\", status AS \\"status\\", loanamortizationmonthsuw AS \\"loanamortizationmonthsuw\\", agreementcoborrowers AS \\"agreementcoborrowers\\", amortizationterm AS \\"amortizationterm\\", applicationpipelinestatus AS \\"applicationpipelinestatus\\", investmenttype AS \\"investmenttype\\", doyouhaveapersonalemailaddress AS \\"doyouhaveapersonalemailaddress\\", personalemailaddress AS \\"personalemailaddress\\", borrowerfullname AS \\"borrowerfullname\\", primaryphonenumber AS \\"primaryphonenumber\\", firstname AS \\"firstname\\", lastname AS \\"lastname\\", officialtitle AS \\"officialtitle\\", emailaddress AS \\"emailaddress\\", fullname AS \\"fullname\\", businessownerphonenumber AS \\"businessownerphonenumber\\", legalnameofbusiness AS \\"legalnameofbusiness\\", borrowerdateofbirth AS \\"dateofbirth\\", personalphysicalstreetnumberandstreetname AS \\"personalphysicalstreetnumberandstreetname\\", personalphysicalcity AS \\"personalphysicalcity\\", personalphysicalstate AS \\"personalphysicalstate\\", personalphysicalzipcode AS \\"personalphysicalzipcode\\", pleaseenteryourfullname AS \\"pleaseenteryourfullname\\", d40a812b3cd3431d8ddc7fc966440538 AS \\"d40a812b3cd3431d8ddc7fc966440538\\", useoffunds AS \\"useoffunds\\", useoffundstotal AS \\"useoffundstotal\\", dbaortradenameifapplicable AS \\"dbaortradenameifapplicable\\", businesslegalstructure AS \\"businesslegalstructure\\", companytaxidentificationnumbertin AS \\"companytaxidentificationnumbertin\\", companywebsite AS \\"companywebsite\\", pleaseselecttheindustrythatbestrepresentsyourprimarylin AS \\"pleaseselecttheindustrythatbestrepresentsyourprimarylin\\", areyouinthealcoholindustryordoyouservealcoholatyourbusi AS \\"areyouinthealcoholindustryordoyouservealcoholatyourbusi\\", companystreetnumberandstreetname AS \\"streetnumberandstreetname\\", companyunitsuitenumber AS \\"unitsuitenumber\\", companycounty AS \\"county\\", businessaddress AS \\"businessaddress\\", ismailingaddresssameasbusinessphysicaladdress AS \\"ismailingaddresssameasbusinessphysicaladdress\\", companymailingaddresscitystatezip AS \\"companymailingaddresscitystatezip\\", borrowerphonenumber AS \\"borrowerphonenumber\\", datefounded AS \\"datefounded\\", companyphonenumber AS \\"companyphonenumber\\", financialprojections AS \\"financialprojections\\", companyaddress AS \\"companyaddress\\", interestonlyperiod AS \\"interestonlyperiod\\", interestonlyperiodstartdate AS \\"interestonlyperiodstartdate\\", interestonlyperiodtermmonths AS \\"interestonlyperiodtermmonths\\", closingdatemonth AS \\"closingdatemonth\\", closingdateday AS \\"closingdateday\\", closingdateyear AS \\"closingdateyear\\", einnumber AS \\"einnumber\\", accountnumber AS \\"accountnumber\\", signersforclosingdocument AS \\"signersforclosingdocument\\", ownershippercentage AS \\"ownershippercentage\\", annualinterestrate AS \\"annualinterestrate\\", totalterm AS \\"totalterm\\", companyemailaddress AS \\"companyemailaddress\\", howmanyemployeesworkforyourcompanyincludingyourself AS \\"howmanyemployeesworkforyourcompanyincludingyourself\\", companyoverview AS \\"companyoverview\\", companyhistory AS \\"companyhistory\\", useoffundsdescription AS \\"useoffundsdescription\\", futureoutlook AS \\"futureoutlook\\", businessawards AS \\"businessawards\\", whichofthefollowingbestdescribesyourbusiness AS \\"whichofthefollowingbestdescribesyourbusiness\\", whichofthefollowingbestdescribesyourbusinessownershipse AS \\"whichofthefollowingbestdescribesyourbusinessownershipse\\", wouldyoudescribeyourbusinessasanyofthefollowingselectal AS \\"wouldyoudescribeyourbusinessasanyofthefollowingselectal\\", businessfederaltaxidnumbereinnumber AS \\"businessfederaltaxidnumbereinnumber\\", typeofindustryuw AS \\"typeofindustryuw\\", naicscode AS \\"naicscode\\", businessstreet AS \\"businessstreet\\", businessunitsuitenumber AS \\"businessunitsuitenumber\\", businesscity AS \\"businesscity\\", businessstate AS \\"businessstate\\", businesszipcode AS \\"businesszipcode\\", businesscounty AS \\"businesscounty\\", loanpurposeloandecisionfinala AS \\"loanpurpose\\", ownerequity AS \\"ownerequity\\", maturityterm AS \\"maturityterm\\", monthlypayment AS \\"monthlypayment\\", roleinbusiness AS \\"roleinbusiness\\", percentownershipinbusinessborrower AS \\"percentownershipinbusinessborrower\\", borrowerguaranteetype AS \\"borrowerguaranteetype\\", collateral AS \\"collateral\\", totalcollateralmarginedvalue AS \\"totalcollateralmarginedvalue\\", thirdsigner AS \\"thirdsigner\\", applicationdecision AS \\"applicationdecision\\", title AS \\"title\\", twoyearfinancialprojectionuploaddoc AS \\"twoyearfinancialprojection\\", sourcesandusesoffundsuploaddoc AS \\"sourcesandusesoffunds\\", minamount AS \\"minamount\\", maxamount AS \\"maxamount\\", securitytype AS \\"securitytype\\", securityinterest AS \\"securityinterest\\", isthisloansubordinated AS \\"isthisloansubordinated\\", personalguarantydescription AS \\"personalguarantydescription\\", incoporationstate AS \\"incoporationstate\\", companystartyear AS \\"companystartyear\\", previousofferings AS \\"previousofferings\\", lastdateoffinancials AS \\"lastdateoffinancials\\", companyfiscalyearend AS \\"companyfiscalyearend\\", collateraldescription AS \\"collateraldescription\\", signeronetitle AS \\"signeronetitle\\", ownershiptype AS \\"ownershiptype\\", owners AS \\"owners\\", directors AS \\"directors\\", typeofindustry AS \\"typeofindustry\\", doesthesoleproprietorshiphaveafederaltaxidnumberalsoref AS \\"doesthesoleproprietorshiphaveafederaltaxidnumberalsoref\\", businessfederaltaxidnumberalsoreferredtoastheeinnumber AS \\"businessfederaltaxidnumberalsoreferredtoastheeinnumber\\", CASE WHEN ( applicationpipelinestatus IS NULL ) AND (\\"status\\" = '\''draft'\'') THEN '\''completed'\'' ELSE applicationpipelinestatus END AS \\"applicationStatus\\" FROM agreement WHERE legalnameofbusiness IN (${campaignName
          .map((name) => formatCampaignNameWithQuotes(name))
          .join(', ')}) AND (companyemailaddress IS NOT NULL) AND (borroweraddresscitystatezip IS NOT NULL)","template-tags":{}},"database":41,"parameters":[]}`,
      };

      let data = qs.stringify(this.query);

      const config = {
        headers: this.headers,
        data: data,
      };
      const request = this.LoanwellClient.post;
      return await request(`/api/dataset/json`, data, config);
    } catch (err) {
      throw err;
    }
  }
}

export default LoanwellInfraService;
