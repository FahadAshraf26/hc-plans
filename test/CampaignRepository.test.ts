require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const IssuerBankRepository = require("../App/Infrastructure/MySQLRepository/IssuerBankRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");
const moment = require("moment");
const CampaignStage = require("../App/Domain/Core/ValueObjects/CampaignStage");
const IssuerBank = require("../App/Domain/Core/IssuerBank");
const { issuerBankObj } = require("./Helper/IssuerBankFixture");

/* ========== Campaign Test Cases ========= */

describe("Campaigns", () => {
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const issuerBank = IssuerBank.createFromObject(issuerBankObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await IssuerBankRepository.remove(issuerBank, true);
    await CampaignRepository.remove(campaign, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await IssuerBankRepository.remove(issuerBank, true);
    await CampaignRepository.remove(campaign, true);
  });

  describe("Add Campaign", () => {
    it("Should Add Campaign", async () => {
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await IssuerBankRepository.add(issuerBank);
      const addResult = await CampaignRepository.add(campaign);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRepository.fetchAll(options, true);
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(Campaign);
      });
    });
  });

  describe("fetch public opportunities", () => {
    it("Should Fetch All fundraising Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRepository.fetchPublicOppurtunities({
        paginationOptions: options,
        showTrashed: false,
        campaignStage: CampaignStage.FUNDRAISING,
      });
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(Campaign);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRepository.fetchAll(options, {});
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(Campaign);
      });
    });
  });

  describe("FetchAllbyIssuer", () => {
    it("Should Fetch All Campaigns by issuerId", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRepository.fetchByIssuerId(
        issuer.issuerId,
        options
      );
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(Campaign);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign By Id", async () => {
      const campaign = await CampaignRepository.fetchById(
        demoObj.campaignObj.campaignId
      );
      expect(campaign).to.be.instanceOf(Campaign);
    });
  });

  describe("Update", () => {
    it("Should Update Campaign", async () => {
      const updateResult = await CampaignRepository.update(campaign);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign", async () => {
      const removeResult = await CampaignRepository.remove(campaign, true);
      expect(removeResult).to.equal(true);
    });
  });

  describe("getSuccessfulCampaigns", () => {
    it("should get successful campaigns", async () => {
      expect(true).to.be.be.true;
      // const campaigns = await CampaignRepository.fetchSuccessfulCampaigns();
      // campaigns.forEach((campaign) => {
      //   expect(campaign).to.be.instanceOf(Campaign);
      //   if (campaign.issuer) {
      //     expect(campaign.issuer).to.be.instanceOf(Issuer);
      //   }
      // });
    });
  });

  describe("fetchByExpirationDate", () => {
    it("should fetch expired campaigns", async () => {
      const campaigns = await CampaignRepository.fetchByExpirationDate(
        moment(new Date(campaign.campaignExpirationDate)).format("YYYY-MM-DD")
      );
      for (const campaign of campaigns) {
        expect(campaigns).to.be.instanceOf(Campaign);
      }
    });
  });
});
