require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const ReleaseRepository = require("../App/Infrastructure/MySQLRepository/ReleaseRepository");
const Release = require("../App/Domain/Core/Release");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== Release Test Cases ========= */

describe("Releases", () => {
  const release = Release.createFromObject(demoObj.releaseObj);

  before(async () => {
    await ReleaseRepository.remove(release, true);
  });

  after(async () => {
    await ReleaseRepository.remove(release, true);
  });

  describe("Add Release", () => {
    it("Should Add Release", async () => {
      const addResult = await ReleaseRepository.add(release);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Releases", async () => {
      const options = new PaginationOptions();
      const result = await ReleaseRepository.fetchAll(options, {});
      const releases = result.getPaginatedData();
      releases.data.forEach((release) => {
        expect(release).to.be.instanceOf(Release);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Release By Id", async () => {
      const release = await ReleaseRepository.fetchById(demoObj.releaseObj.releaseId);
      expect(release).to.be.instanceOf(Release);
    });
  });

  describe("Update", () => {
    it("Should Update Release Description", async () => {
      release.description = "This is updated description";
      const updateResult = await ReleaseRepository.update(release);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Release", async () => {
      const removeResult = await ReleaseRepository.remove(release);
      expect(removeResult).to.equal(true);
    });
  });
});
