require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const IssuerRepository = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const Issuer = require("../App/Domain/Core/Issuer");
const Owner = require("../App/Domain/Core/Owner/Owner");
const OwnerDAO = require("../App/Infrastructure/MySQLRepository/OwnerDAO");
const User = require("../App/Domain/Core/User/User");
const IssuerOwner = require("../App/Domain/Core/IssuerOwner");
const demoObj = require("./Helper/demoObj.js");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== Issuer Test Cases ========= */

describe("Issuers", () => {
  const naic = NAIC.createFromObject(demoObj.naicObj);
  const owner = Owner.createFromObject(demoObj.ownerObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword(demoObj.userObj.password);
  const issuerOwner = IssuerOwner.createFromObject(demoObj.issuerOwnerObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await OwnerDAO.remove(owner, true);
    await UserRepository.remove(user, true);
    await IssuerRepository.remove(issuer, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await OwnerDAO.remove(owner, true);
    await UserRepository.remove(user, true);
    await IssuerRepository.remove(issuer, true);
  });

  describe("Add User", () => {
    it("Should Add User", async () => {
      const addResult = await UserRepository.add(user);
      await OwnerDAO.add(owner);
      expect(addResult).to.equal(true);
    });
  });

  describe("Add Issuer", () => {
    it("Should Add Issuer", async () => {
      await NAICRepository.add(naic);
      const addResult = await IssuerRepository.add(issuer);
      await IssuerRepository._updateIssuerOwnerRef(issuer);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllWithDeleted", () => {
    it("Should Fetch All Issuers", async () => {
      const options = new PaginationOptions();
      const result = await IssuerRepository.fetchAll(options, true);
      const issuers = result.getPaginatedData();
      issuers.data.forEach((issuer) => {
        expect(issuer).to.be.instanceOf(Issuer);
        for (const owner of issuer.owners) {
          expect(owner).to.be.instanceOf(Owner);
        }
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Issuers", async () => {
      const options = new PaginationOptions();
      const result = await IssuerRepository.fetchAll(options, true);
      const issuers = result.getPaginatedData();
      issuers.data.forEach((issuer) => {
        expect(issuer).to.be.instanceOf(Issuer);
        issuer.owners.forEach((owner) => {
          expect(owner).to.be.instanceOf(Owner);
        });
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Issuer By Id", async () => {
      const issuer = await IssuerRepository.fetchById(
        demoObj.issuerObj.issuerId
      );
      expect(issuer).to.be.instanceOf(Issuer);
      issuer.owners.forEach((owner) => {
        expect(owner).to.be.instanceOf(Owner);
      });
    });
  });

  describe("Update", () => {
    it("Should Update Issuer", async () => {
      issuer.issuerName = "dd56";
      await IssuerRepository._updateIssuerOwnerRef(issuer);
      const updateResult = await IssuerRepository.update(issuer);
      expect(updateResult).to.equal(true);
    });
  });

  describe(" Soft Remove", () => {
    it("Should Remove Issuer", async () => {
      const removeResult = await IssuerRepository.remove(issuer, true);
      expect(removeResult).to.equal(true);
    });
  });
});
