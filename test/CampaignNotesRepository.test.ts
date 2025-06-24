require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignNotesRepository = require("../App/Infrastructure/MySQLRepository/CampaignNotesRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignNotes = require("../App/Domain/Core/CampaignNotes");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignNotes", () => {
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);
  const campaignNotes = CampaignNotes.createFromObject(
    demoObj.campaignNotesObj
  );
  const naic = NAIC.createFromObject(demoObj.naicObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignNotesRepository.remove(campaignNotes, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await CampaignNotesRepository.remove(campaignNotes, true);
  });

  describe("Add Campaign Notes", () => {
    it("Should Add Campaign", async () => {
      await NAICRepository.add(naic);
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await CampaignNotesRepository.add(campaignNotes);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignNotesRepository.fetchAll(options, true);
      const campaignNotess = result.getPaginatedData();
      campaignNotess.data.forEach((campaign) => {
        expect(campaign).to.be.instanceOf(CampaignNotes);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Campaigns", async () => {
      const options = new PaginationOptions();
      const result = await CampaignNotesRepository.fetchAll(options);
      const campaignNotess = result.getPaginatedData();
      campaignNotess.data.forEach((campaignNotes) => {
        expect(campaignNotes).to.be.instanceOf(CampaignNotes);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Campaign By Id", async () => {
      const campaignNotesEntity = await CampaignNotesRepository.fetchById(
        campaignNotes.campaignNotesId
      );
      expect(campaignNotesEntity).to.be.instanceOf(CampaignNotes);
    });
  });

  describe("Update", () => {
    it("Should Update Campaign", async () => {
      campaignNotes.notes = "kuxh";
      const updateResult = await CampaignNotesRepository.update(campaignNotes);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Campaign", async () => {
      const removeResult = await CampaignNotesRepository.remove(
        campaignNotes,
        true
      );
      expect(removeResult).to.equal(true);
    });
  });
});
