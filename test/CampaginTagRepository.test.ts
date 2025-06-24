require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignTagRepository = require("../App/Infrastructure/MySQLRepository/CampaignTagRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignTag = require("../App/Domain/Core/CampaignTag");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const Tag = require("../App/Domain/Core/Tag/Tag");
const TagRepository = require("../App/Infrastructure/MySQLRepository/TagRepository");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignTags", () => {
  const tag = Tag.createFromObject(demoObj.tagObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const campaignTag = CampaignTag.createFromObject(demoObj.campaignTagObj);

  before(async () => {
    await TagRepository.remove(tag, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignTagRepository.removeByTagCampaign(tag, campaign, true);
  });

  after(async () => {
    await TagRepository.remove(tag, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignTagRepository.removeByTagCampaign(tag, campaign, true);
  });

  describe("Add Campaign Tag", () => {
    it("Should Add Campaign tag", async () => {
      await TagRepository.add(tag);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignTagRepository.add(campaign.campaignId, [
        campaignTag,
      ]);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAll by campaign", () => {
    it("Should Fetch All Campaign tags", async () => {
      const options = new PaginationOptions();
      const result = await CampaignTagRepository.getByCampaign(
        campaign.campaignId,
        options
      );
      const campaignTag = result.getPaginatedData();
      campaignTag.data.forEach((campaignTag) => {
        expect(campaignTag).to.be.instanceOf(CampaignTag);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign tag By Id", async () => {
      const campaign = await CampaignTagRepository.fetchById(
        campaignTag.campaignTagId
      );
      expect(campaign).to.be.instanceOf(CampaignTag);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign tag", async () => {
      const removeResult = await CampaignTagRepository.removeByTagCampaign(
        tag,
        campaign
      );

      expect(removeResult).to.equal(true);
    });
  });
});
