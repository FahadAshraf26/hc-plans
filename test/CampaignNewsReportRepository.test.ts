require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const campaignQAReportRepository = require("../App/Infrastructure/MySQLRepository/CampaignQAReportRepository");
const CampaignQAReport = require("../App/Domain/Core/CampaignQAReport");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const CampaignQAReportRepository = require("../App/Infrastructure/MySQLRepository/CampaignQARepository");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const User = require("../App/Domain/Core/User/User");
const CampaignQA = require("../App/Domain/Core/CampaignQA");
const CampaignQARepository = require("../App/Infrastructure/MySQLRepository/CampaignQARepository");
require("../App/Infrastructure/Model/CampaignQAReport");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");
/* ========== CampaignQAReport Test Cases ========= */

describe("CampaignQAReports", () => {
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);
  const campaignQA = CampaignQA.createFromObject(demoObj.campaignQAObj);
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword("12345");
  const campaignQAReport = CampaignQAReport.createFromObject(
    demoObj.campaignQAReportObj
  );

  before(async () => {
    await NAICRepository.remove(naic, true);

    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await campaignQAReportRepository.remove(campaignQAReport, true);
    await CampaignQAReportRepository.remove(campaignQA, true);
    await UserRepository.remove(user, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);

    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await campaignQAReportRepository.remove(campaignQAReport, true);
    await CampaignQAReportRepository.remove(campaignQA, true);
    await UserRepository.remove(user, true);
  });

  describe("Add CampaignQAReport", () => {
    it("Should Add CampaignQAReport", async () => {
      await UserRepository.add(user);
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      await CampaignQARepository.add(campaignQA);
      const addResult = await campaignQAReportRepository.add(campaignQAReport);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All CampaignQAReports", async () => {
      const options = new PaginationOptions();
      const result = await campaignQAReportRepository.fetchAll(options, true);
      const campaignQAReports = result.getPaginatedData();
      campaignQAReports.data.forEach((campaignQAReport) => {
        expect(campaignQAReport).to.be.instanceOf(CampaignQAReport);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All CampaignQAReports", async () => {
      const options = new PaginationOptions();
      const result = await campaignQAReportRepository.fetchAll(options, {});
      const campaignQAReports = result.getPaginatedData();
      campaignQAReports.data.forEach((campaignQAReport) => {
        expect(campaignQAReport).to.be.instanceOf(CampaignQAReport);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch CampaignQAReport By Id", async () => {
      const campaignQAReport = await campaignQAReportRepository.fetchById(
        demoObj.campaignQAReportObj.campaignQAReportId
      );
      expect(campaignQAReport).to.be.instanceOf(CampaignQAReport);
    });
  });

  describe("FetchCountByCampaignQAId", () => {
    it("Should Fetch CampaignQAReport Count By CampaignQAId", async () => {
      const count = await campaignQAReportRepository.fetchCountByCampaignQA(
        demoObj.campaignQAReportObj.campaignQAId
      );

      expect(typeof count).to.eq("number");
    });
  });

  describe("Update", () => {
    it("Should Update CampaignQAReport", async () => {
      campaignQAReport.campaignQAReport = "kuxh";
      const updateResult = await campaignQAReportRepository.update(
        campaignQAReport
      );
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove CampaignQAReport", async () => {
      const removeResult = await campaignQAReportRepository.remove(
        campaignQAReport
      );
      expect(removeResult).to.equal(true);
    });
  });
});
