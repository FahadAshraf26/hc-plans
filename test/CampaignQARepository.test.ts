require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignQARepository = require("../App/Infrastructure/MySQLRepository/CampaignQARepository");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignQA = require("../App/Domain/Core/CampaignQA");
const Investor = require("../App/Domain/Core/Investor/Investor");
const User = require("../App/Domain/Core/User/User");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignQAs", () => {
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword("1234");
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const campaignQA = CampaignQA.createFromObject(demoObj.campaignQAObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await CampaignQARepository.remove(campaignQA, true);
    await UserRepository.remove(user, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await CampaignQARepository.remove(campaignQA, true);
    await UserRepository.remove(user, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
  });

  describe("Add Campaign QA", () => {
    it("Should Add Campaign", async () => {
      await UserRepository.add(user);
      await NAICRepository.add(naic, true);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignQARepository.add(campaignQA);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignQARepository.fetchAll(options, true);
      const campaignQA = result.getPaginatedData();
      campaignQA.data.forEach((campaignQA) => {
        expect(campaignQA).to.be.instanceOf(CampaignQA);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignQARepository.fetchAll(options);
      const campaignQA = result.getPaginatedData();
      campaignQA.data.forEach((campaignQA) => {
        expect(campaignQA).to.be.instanceOf(CampaignQA);
      });
    });
  });

  describe("FetchAll by campaign", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignQARepository.fetchByCampaign(
        campaign.campaignId,
        options
      );
      const campaignQA = result.getPaginatedData();
      campaignQA.data.forEach((campaignQA) => {
        expect(campaignQA).to.be.instanceOf(CampaignQA);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign By Id", async () => {
      const campaign = await CampaignQARepository.fetchById(
        campaignQA.campaignQAId
      );
      expect(campaign).to.be.instanceOf(CampaignQA);
    });
  });

  describe("Update", () => {
    it("Should Update Campaign", async () => {
      campaignQA.text = "kuxh";
      const updateResult = await CampaignQARepository.update(campaignQA);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign", async () => {
      const removeResult = await CampaignQARepository.remove(campaignQA, true);
      expect(removeResult).to.equal(true);
    });
  });
});
