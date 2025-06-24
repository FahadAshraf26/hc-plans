require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const campaignEscrowBankRepository = require("../App/Infrastructure/MySQLRepository/CampaignEscrowBankRepository");
const CampaignEscrowBank = require("../App/Domain/Core/CampaignEscrowBank");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");

/* ========== CampaignEscrowBank Test Cases ========= */

describe("CampaignEscrowBanks", () => {
  const campaignEscrowBank = CampaignEscrowBank.createFromObject(
    demoObj.campaignEscrowBankObj
  );
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const campaign = Campaign.createFromObject(demoObj.campaignObj);

  before(async () => {
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await campaignEscrowBankRepository.remove(campaignEscrowBank, true);
  });

  after(async () => {
    await IssuerRepsoitory.remove(issuer, true);
    await CampaignRepository.remove(campaign, true);
    await campaignEscrowBankRepository.remove(campaignEscrowBank, true);
  });

  describe("Add CampaignEscrowBank", () => {
    it("Should Add CampaignEscrowBank", async () => {
      await IssuerRepsoitory.add(issuer);
      await CampaignRepository.add(campaign);
      const addResult = await campaignEscrowBankRepository.add(
        campaignEscrowBank
      );
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchById", () => {
    it("Should Fetch CampaignEscrowBank By Id", async () => {
      const campaignEscrowBank = await campaignEscrowBankRepository.fetchById(
        demoObj.campaignEscrowBankObj.campaignEscrowBankId
      );
      expect(campaignEscrowBank).to.be.instanceOf(CampaignEscrowBank);
    });
  });

  describe("Update", () => {
    it("Should Update CampaignEscrowBank", async () => {
      campaignEscrowBank.campaignEscrowBank = "kuxh";
      const updateResult = await campaignEscrowBankRepository.update(
        campaignEscrowBank
      );
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove CampaignEscrowBank", async () => {
      const removeResult = await campaignEscrowBankRepository.remove(
        campaignEscrowBank
      );
      expect(removeResult).to.equal(true);
    });
  });
});
