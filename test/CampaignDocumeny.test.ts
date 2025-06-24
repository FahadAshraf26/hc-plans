require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const CampaignRepository = require("../App/Infrastructure/MySQLRepository/CampaignRepository");
const CampaignDocumentRepository = require("../App/Infrastructure/MySQLRepository/CampaignDocumentRepository");
const Campaign = require("../App/Domain/Core/Campaign");
const CampaignDocument = require("../App/Domain/CampaignDocument/CampaignDocument");
const User = require("../App/Domain/Core/User/User");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Campaign Test Cases ========= */

describe("CampaignDocuments", () => {
    const user = User.createFromObject(demoObj.userObj);
    user.setPassword(demoObj.userObj.password);
    const issuer = Issuer.createFromObject(demoObj.issuerObj);
    const campaign = Campaign.createFromObject(demoObj.campaignObj);
    const campaignDocument = CampaignDocument.createFromObject(
        demoObj.campaignDocumentObj
    );

    before(async () => {
        await IssuerRepsoitory.remove(issuer, true);
        await CampaignRepository.remove(campaign, true);
        await CampaignDocumentRepository.remove(campaignDocument, true);
    });

    after(async () => {
        await IssuerRepsoitory.remove(issuer, true);
        await CampaignRepository.remove(campaign, true);
        await CampaignDocumentRepository.remove(campaignDocument, true);
    });

    describe("Add Campaign QA", () => {
        it("Should Add Campaign", async () => {
            await IssuerRepsoitory.add(issuer);
            await CampaignRepository.add(campaign);
            const addResult = await CampaignDocumentRepository.add(campaignDocument);
            expect(addResult).to.equal(true);
        });
    });

    describe("FetchAllwithDeleted", () => {
        it("Should Fetch All Campaigns", async () => {
            const options = new PaginationOptions();
            const result = await CampaignDocumentRepository.fetchAll(options, true);
            const campaigns = result.getPaginatedData();
            campaigns.data.forEach((campaign) => {
                expect(campaign).to.be.instanceOf(CampaignDocument);
            });
        });
    });

    describe("FetchAllByCampaign", () => {
        it("Should Fetch All Campaigns", async () => {
            const options = new PaginationOptions();
            const result = await CampaignDocumentRepository.fetchByCampaign(
                campaign.campaignId,
                options, {}
            );
            const campaigns = result.getPaginatedData();
            campaigns.data.forEach((campaign) => {
                expect(campaign).to.be.instanceOf(CampaignDocument);
            });
        });
    });

    describe("FetchAll", () => {
        it("Should Fetch All Campaigns", async () => {
            const options = new PaginationOptions();
            const result = await CampaignDocumentRepository.fetchAll(options);
            const campaigns = result.getPaginatedData();
            campaigns.data.forEach((campaign) => {
                expect(campaign).to.be.instanceOf(CampaignDocument);
            });
        });
    });

    describe("FetchById", () => {
        it("Should Fetch Campaign By Id", async () => {
            const campaign = await CampaignDocumentRepository.fetchById(
                campaignDocument.campaignDocumentId
            );
            expect(campaign).to.be.instanceOf(CampaignDocument);
        });
    });

    describe("Update", () => {
        it("Should Update Campaign", async () => {
            campaignDocument.name = "kuxh";
            const updateResult = await CampaignDocumentRepository.update(
                campaignDocument
            );
            expect(updateResult).to.equal(true);
        });
    });

    describe("Remove", () => {
        it("Should Remove Campaign", async () => {
            const removeResult = await CampaignDocumentRepository.remove(
                campaignDocument,
                true
            );
            expect(removeResult).to.equal(true);
        });
    });
});
