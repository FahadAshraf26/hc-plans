require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const IssuerBankRepository = require("../App/Infrastructure/MySQLRepository/IssuerBankRepository");
const IssuerBank = require("../App/Domain/Core/IssuerBank");
const demoObj = require("./Helper/demoObj");
const { issuerBankObj } = require("./Helper/IssuerBankFixture");
const User = require("../App/Domain/Core/User/User");
const Issuer = require("../App/Domain/Core/Issuer");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const IssuerRepository = require("../App/Infrastructure/MySQLRepository/IssuerRepository");
const NAICRepository = require("../App/Infrastructure/MySQLRepository/NAICRepository");
const NAIC = require("../App/Domain/Core/NAIC");

/* ========== IssuerBank Test Cases ========= */

describe("IssuerBanks", () => {
  const user = User.createFromObject(demoObj.userObj);
  const naic = NAIC.createFromObject(demoObj.naicObj);
  const issuer = Issuer.createFromObject(demoObj.issuerObj);
  user.setOwner(demoObj.ownerObj);
  user.setPassword("test");

  const issuerBank = IssuerBank.createFromObject(issuerBankObj);

  before(async () => {
    await NAICRepository.remove(naic, true);
    await UserRepository.remove(user, true);
    await IssuerRepository.remove(issuer, true);
    await IssuerBankRepository.remove(issuerBank, true);
  });

  after(async () => {
    await NAICRepository.remove(naic, true);
    await UserRepository.remove(user, true);
    await IssuerRepository.remove(issuer, true);
    await IssuerBankRepository.remove(issuerBank, true);
  });

  describe("Add IssuerBank", () => {
    it("Should Add IssuerBank", async () => {
      await NAICRepository.add(naic);
      await IssuerRepository.add(issuer);
      await UserRepository.add(user);
      const addResult = await IssuerBankRepository.add(issuerBank);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchById", () => {
    it("Should Fetch IssuerBank By Id", async () => {
      const issuerBank = await IssuerBankRepository.fetchById(
        issuerBankObj.issuerBankId
      );

      expect(issuerBank).to.be.instanceOf(IssuerBank);
      expect(issuerBank.accountName).to.exist;
      expect(issuerBank.dwollaSourceId).to.exist;
      expect(issuerBank.bankToken).to.exist;
      expect(issuerBank.accountType).to.exist;
      expect(issuerBank.lastFour).to.exist;
      expect(issuerBank.accountNumber).to.exist;
      expect(issuerBank.routingNumber).to.exist;
      expect(issuerBank.wireRoutingNumber).to.exist;
    });
  });

  describe("Update", () => {
    it("Should Update IssuerBank", async () => {
      issuerBank.bankToken = "2";
      const updateResult = await IssuerBankRepository.updateIssuerBank(
        issuerBank
      );
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove IssuerBank", async () => {
      const removeResult = await IssuerBankRepository.remove(issuerBank);
      expect(removeResult).to.equal(true);
    });
  });
});
