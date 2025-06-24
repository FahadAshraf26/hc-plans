require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const tosRepository = require("../App/Infrastructure/MySQLRepository/ToSRepository");
const ToS = require("../App/Domain/Core/ToS");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== ToS Test Cases ========= */

describe("ToS", () => {
  const tos = ToS.createFromObject(demoObj.tosObj);

  before(async () => {
    await tosRepository.remove(tos, true);
  });

  after(async () => {
    await tosRepository.remove(tos, true);
  });

  describe("Add ToS", () => {
    it("Should Add ToS", async () => {
      const addResult = await tosRepository.add(tos);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All ToS", async () => {
      const options = new PaginationOptions();
      const result = await tosRepository.fetchAll(options, true);
      const toss = result.getPaginatedData();
      toss.data.forEach((tos) => {
        expect(tos).to.be.instanceOf(ToS);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All ToS", async () => {
      const options = new PaginationOptions();
      const result = await tosRepository.fetchAll(options, {});
      const toss = result.getPaginatedData();
      toss.data.forEach((tos) => {
        expect(tos).to.be.instanceOf(ToS);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch ToS By Id", async () => {
      const tos = await tosRepository.fetchById(demoObj.tosObj.tosId);
      expect(tos).to.be.instanceOf(ToS);
    });
  });

  describe("Update", () => {
    it("Should Update ToS", async () => {
      tos.privacyPolicyUpdateDate = false;
      const updateResult = await tosRepository.update(tos);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove ToS", async () => {
      const removeResult = await tosRepository.remove(tos);
      expect(removeResult).to.equal(true);
    });
  });
});
