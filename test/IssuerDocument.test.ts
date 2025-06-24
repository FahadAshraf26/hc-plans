require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const IssuerRepository = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const IssuerDocumentRepository = require("../App/Infrastructure/MySQLRepository/IssuerDocumentRepository");
const IssuerDocument = require("../App/Domain/Core/IssuerDocument");
const User = require("../App/Domain/Core/User/User");
const Issuer = require("../App/Domain/Core/Issuer");
const IssuerRepsoitory = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Issuer Test Cases ========= */

describe("IssuerDocuments", () => {
    const user = User.createFromObject(demoObj.userObj);
    const naic = NAIC.createFromObject(demoObj.naicObj);
    user.setPassword(demoObj.userObj.password);
    const issuer = Issuer.createFromObject(demoObj.issuerObj);
    const issuerDocument = IssuerDocument.createFromObject(
        demoObj.issuerDocumentObj
    );

    before(async () => {
        await NAICRepository.remove(naic, true);
        await IssuerRepository.remove(issuer, true);
        await IssuerDocumentRepository.remove(issuerDocument, true);
    });

    after(async () => {
        await NAICRepository.remove(naic, true);
        await IssuerRepsoitory.remove(issuer, true);
        await IssuerDocumentRepository.remove(issuerDocument, true);
    });

    describe("Add Issuer Document", () => {
        it("Should Add Issuer Document", async () => {
            await NAICRepository.add(naic);
            await IssuerRepository.add(issuer);
            const addResult = await IssuerDocumentRepository.add(issuerDocument);
            expect(addResult).to.equal(true);
        });
    });

    describe("FetchAllwithDeleted", () => {
        it("Should Fetch All Issuers Dcoument", async () => {
            const options = new PaginationOptions();
            const result = await IssuerDocumentRepository.fetchAll(options, true);
            const issuers = result.getPaginatedData();
            issuers.data.forEach((issuer) => {
                expect(issuer).to.be.instanceOf(IssuerDocument);
            });
        });
    });

    describe("FetchAllByIssuer", () => {
        it("Should Fetch All Issuers Document", async () => {
            const options = new PaginationOptions();
            const result = await IssuerDocumentRepository.fetchByIssuer(
                issuer.issuerId,
                options, {}
            );
            const issuers = result.getPaginatedData();
            issuers.data.forEach((issuer) => {
                expect(issuer).to.be.instanceOf(IssuerDocument);
            });
        });
    });

    describe("FetchAll", () => {
        it("Should Fetch All Issuers Document", async () => {
            const options = new PaginationOptions();
            const result = await IssuerDocumentRepository.fetchAll(options);
            const issuers = result.getPaginatedData();
            issuers.data.forEach((issuer) => {
                expect(issuer).to.be.instanceOf(IssuerDocument);
            });
        });
    });

    describe("FetchById", () => {
        it("Should Fetch Issuer Document By Id", async () => {
            const issuer = await IssuerDocumentRepository.fetchById(
                issuerDocument.issuerDocumentId
            );
            expect(issuer).to.be.instanceOf(IssuerDocument);
        });
    });

    describe("Update", () => {
        it("Should Update Issuer Document", async () => {
            issuerDocument.name = "kuxh";
            const updateResult = await IssuerDocumentRepository.update(
                issuerDocument
            );
            expect(updateResult).to.equal(true);
        });
    });

    describe("Remove", () => {
        it("Should Remove Issuer Document", async () => {
            const removeResult = await IssuerDocumentRepository.remove(
                issuerDocument,
                true
            );
            expect(removeResult).to.equal(true);
        });
    });
});
