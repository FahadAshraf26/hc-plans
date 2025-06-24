require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignMediaRepository = require("../App/Infrastructure/MySQLRepository/CampaignMediaRepsoitory");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignMedia = require("../App/Domain/Core/CampaignMedia");
const User = require("../App/Domain/Core/User/User");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignMedias", () => {
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword(demoObj.userObj.password);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const campaignMedia = CampaignMedia.createFromObject(
    demoObj.campaignMediaObj
  );
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignMediaRepository.remove(campaignMedia, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignMediaRepository.remove(campaignMedia, true);
  });

  describe("Add Campaign QA", () => {
    it("Should Add Campaign", async () => {
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignMediaRepository.add(campaignMedia);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignMediaRepository.fetchAll(options, true);
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(CampaignMedia);
      });
    });
  });

  describe("FetchAllByCampaign", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignMediaRepository.fetchByCampaign(
        campaign.campaignId,
        options
      );
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(CampaignMedia);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignMediaRepository.fetchAll(options);
      const campaigns = result.getPaginatedData();
      campaigns.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(CampaignMedia);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign By Id", async () => {
      const campaign = await CampaignMediaRepository.fetchById(
        campaignMedia.campaignMediaId
      );
      expect(campaign).to.be.instanceOf(CampaignMedia);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign", async () => {
      const removeResult = await CampaignMediaRepository.remove(
        campaignMedia,
        true
      );
      expect(removeResult).to.equal(true);
    });
  });
});
