require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const tagRepository = require("../App/Infrastructure/MySQLRepository/TagRepository");
const Tag = require("../App/Domain/Core/Tag/Tag");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== Tag Test Cases ========= */

describe("Tags", () => {
  const tag = Tag.createFromObject(demoObj.tagObj);

  before(async () => {
    await tagRepository.remove(tag, true);
  });

  after(async () => {
    await tagRepository.remove(tag, true);
  });

  describe("Add Tag", () => {
    it("Should Add Tag", async () => {
      const addResult = await tagRepository.add(tag);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAllwithDeleted", () => {
    it("Should Fetch All Tags", async () => {
      const options = new PaginationOptions();
      const result = await tagRepository.fetchAll(options, true);
      const tags = result.getPaginatedData();
      tags.data.forEach((tag) => {
        expect(tag).to.be.instanceOf(Tag);
      });
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All Tags", async () => {
      const options = new PaginationOptions();
      const result = await tagRepository.fetchAll(options, {});
      const tags = result.getPaginatedData();
      tags.data.forEach((tag) => {
        expect(tag).to.be.instanceOf(Tag);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch Tag By Id", async () => {
      const tag = await tagRepository.fetchById(demoObj.tagObj.tagId);
      expect(tag).to.be.instanceOf(Tag);
    });
  });

  describe("Update", () => {
    it("Should Update Tag", async () => {
      tag.tag = "kuxh";
      const updateResult = await tagRepository.update(tag);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove Tag", async () => {
      const removeResult = await tagRepository.remove(tag);
      expect(removeResult).to.equal(true);
    });
  });
});
