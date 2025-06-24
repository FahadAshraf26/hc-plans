require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const northCapitalWebhookRepository = require("../App/Infrastructure/MySQLRepository/NorthCapitalWebhook");
const demoObj = require("../test/Helper/NorthCapitalWebhookFixture.js");
const NorthCapitalWebhookStatus = require("../App/Domain/NorthCapitalWebhooks/NorthCapitalWebhookStatus");
const NorthCapitalWebhookType = require("../App/Domain/NorthCapitalWebhooks/NorthCapitalWebhookType");
const NorthCapitalWebhook = require("../App/Domain/NorthCapitalWebhooks/NorthCapitalWebhook");

describe("NorthCapitalWebhookRepository", () => {
    let northCapitalWebhookEntity= "";
    before( async () => {
        const createTradeDTO = demoObj.northCapitalWebhookDTO
        const webhookType = NorthCapitalWebhookType.createFromValue(createTradeDTO.webhookType);
        createTradeDTO.status = NorthCapitalWebhookStatus.webhookStatus.success
        const status = NorthCapitalWebhookStatus.createFromValue(createTradeDTO.status);

        northCapitalWebhookEntity = NorthCapitalWebhook.create({...createTradeDTO, webhookType, status});
    });

    describe("Add Webhook", () => {
        it("should add north capital webhook", async () => {
            const result = await northCapitalWebhookRepository.add(northCapitalWebhookEntity);
            expect(result).to.equal(true);
        })
    });

    describe("fetch Webhook By Id", () => {
        it("should fetch single north capital webhook", async () => {
            const results = await northCapitalWebhookRepository.fetchById(northCapitalWebhookEntity._webhookId);
            expect(results).to.be.instanceOf(NorthCapitalWebhook);
        })
    });

    describe("remove webhook", () => {
        it("should north north capital webhook by id", async () => {
            const result = await northCapitalWebhookRepository.remove(northCapitalWebhookEntity);
            expect(result).to.equal(true);
        })
    });

})