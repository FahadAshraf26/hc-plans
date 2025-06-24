require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const Campaign = require("../App/Domain/Core/Campaign");
const Issuer = require("../App/Domain/Core/Issuer");
const CampaignInfo = require("../App/Domain/Core/CampaignInfo/CampaignInfo");
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignInfoRepository = require("../App/Infrastructure/MySQLRepository/CampaignInfoRepository");
const IssuerRepository = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignInfo", () => {
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const info = CampaignInfo.createFromObject(demoObj.campaignInfoObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignInfoRepository.remove(info, true);
    await IssuerRepository.remove(issuer, true);
  });
  after(async () => {
    await NAICRepository.remove(naic, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignInfoRepository.remove(info, true);
    await IssuerRepository.remove(issuer, true);
  });

  describe("Add CampaignInfo", () => {
    it("Should Add CampaignInfo", async () => {
      await NAICRepository.add(naic);
      await IssuerRepository.add(issuer);
      await CampaignRepository.add(campaign);
      info.financialHistory = '["test"]';
      info.milestones = '["test"]';
      const addResult = await CampaignInfoRepository.add(info);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllWithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignInfoRepository.fetchAll(options, true);
      const campaignsInfo = result.getPaginatedData();
      campaignsInfo.data.forEach((infoObj) => {
        expect(infoObj).to.be.instanceOf(CampaignInfo);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignInfoRepository.fetchAll(options);
      const campaignsInfo = result.getPaginatedData();
      campaignsInfo.data.forEach((infoObj) => {
        expect(infoObj).to.be.instanceOf(CampaignInfo);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Info By Id", async () => {
      const campaignInfo = await CampaignInfoRepository.fetchById(
        demoObj.campaignInfoObj.campaignInfoId
      );
      expect(campaignInfo).to.be.instanceOf(CampaignInfo);
    });
  });

  describe("Update", () => {
    it("Should Update CampaignInfo", async () => {
      info.financialHistory = "Some bullets points";
      const updateResult = await CampaignInfoRepository.update(info);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove CampaignInfo", async () => {
      const removeResult = await CampaignInfoRepository.remove(info, true);
      expect(removeResult).to.equal(true);
    });
  });
});
