require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const Issuer = require("../App/Domain/Core/Issuer");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignNews = require("../App/Domain/Core/CampaignNews");
const CampaignNewsMedia = require("../App/Domain/Core/CampaignNewsMedia");
const IssuerRepository = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignNewsRepository = require("../App/Infrastructure/MySQLRepository/CampaignNewsRepository");
const CampaignNewsMediaDAO = require("../App/Infrastructure/MySQLRepository/CampaignNewsMediaDAO");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

const demoObj = require("./Helper/demoObj");

/* ========== Campaign News Test Cases ========= */

describe("CampaignNews", () => {
  const naic = NAIC.createFromObject(demoObj.naicObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const news = CampaignNews.createFromObject(demoObj.campaignNewsObj);
  const newsMedia = CampaignNewsMedia.createFromObject(
    demoObj.campaignNewsMediaObj
  );

  before(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepository.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignNewsRepository.remove(news, true);
    await CampaignNewsMediaDAO.remove(newsMedia, true);
  });
  after(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepository.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignNewsRepository.remove(news, true);
    await CampaignNewsMediaDAO.remove(newsMedia, true);
  });

  describe("Add CampaignNews", () => {
    it("Should Add Campaign News", async () => {
      await NAICRepository.add(naic);
      await IssuerRepository.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignNewsRepository.add(news);
      await CampaignNewsMediaDAO.add(newsMedia);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllWithDeleted", () => {
    it("Should Fetch All Campaign News", async () => {
      const options = new PaginationOptions();
      const result = await CampaignNewsRepository.fetchAll(options, true);
      const campaignNews = result.getPaginatedData();
      campaignNews.data.forEach((newsObj) => {
        expect(newsObj).to.be.instanceOf(CampaignNews);
        if (newsObj.campaignNewsMedia) {
          newsObj.campaignMedia.forEach((newsMediaObj) => {
            expect(newsMediaObj).to.be.instanceOf(CampaignNewsMedia);
          });
        }
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaign News", async () => {
      const options = new PaginationOptions();
      const result = await CampaignNewsRepository.fetchAll(options);
      const campaignNews = result.getPaginatedData();
      campaignNews.data.forEach((newsObj) => {
        expect(newsObj).to.be.instanceOf(CampaignNews);
        if (newsObj.campaignNewsMedia) {
          newsObj.campaignMedia.forEach((newsMediaObj) => {
            expect(newsMediaObj).to.be.instanceOf(CampaignNewsMedia);
          });
        }
      });
    });
  });

  describe("FetchAll by campaign", () => {
    it("Should Fetch All Campaign News", async () => {
      const options = new PaginationOptions();
      const result = await CampaignNewsRepository.fetchByCampaign(
        demoObj.campaignNewsObj.campaignId,
        options,
        {}
      );
      const campaignNews = result.getPaginatedData();
      campaignNews.data.forEach((newsObj) => {
        expect(newsObj).to.be.instanceOf(CampaignNews);
        if (newsObj.campaignNewsMedia) {
          newsObj.campaignMedia.forEach((newsMediaObj) => {
            expect(newsMediaObj).to.be.instanceOf(CampaignNewsMedia);
          });
        }
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign News By Id", async () => {
      const campaignNews = await CampaignNewsRepository.fetchById(
        demoObj.campaignNewsObj.campaignNewsId
      );
      expect(campaignNews).to.be.instanceOf(CampaignNews);
    });
  });

  describe("Update", () => {
    it("Should Update Campaign News", async () => {
      news.name = "test name";
      const updateResult = await CampaignNewsRepository.update(news);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign News", async () => {
      const removeResult = await CampaignNewsRepository.remove(news, true);
      expect(removeResult).to.equal(true);
    });
  });
});
