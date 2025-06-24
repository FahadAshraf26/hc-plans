require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignRiskRepository = require("../App/Infrastructure/MySQLRepository/CampaignRiskRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignRisk = require("../App/Domain/Core/CampaignRisk");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignRisks", () => {
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const campaignRisk = CampaignRisk.createFromObject(demoObj.campaignRiskObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);

    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignRiskRepository.remove(campaignRisk, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);

    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignRiskRepository.remove(campaignRisk, true);
  });

  describe("Add Campaign QA", () => {
    it("Should Add Campaign", async () => {
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignRiskRepository.add(campaignRisk);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRiskRepository.fetchAll(options, true);
      const campaignRisks = result.getPaginatedData();
      campaignRisks.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(CampaignRisk);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignRiskRepository.fetchAll(options);
      const campaignRisks = result.getPaginatedData();
      campaignRisks.data.forEach((campaignRisk) => {
        expect(campaignRisk).to.be.instanceOf(CampaignRisk);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign By Id", async () => {
      const campaignRiskEntity = await CampaignRiskRepository.fetchById(
        campaignRisk.campaignRiskId
      );
      expect(campaignRiskEntity).to.be.instanceOf(CampaignRisk);
    });
  });

  describe("Update", () => {
    it("Should Update Campaign", async () => {
      campaignRisk.title = "kuxh";
      const updateResult = await CampaignRiskRepository.update(campaignRisk);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign", async () => {
      const removeResult = await CampaignRiskRepository.remove(
        campaignRisk,
        true
      );
      expect(removeResult).to.equal(true);
    });
  });
});
