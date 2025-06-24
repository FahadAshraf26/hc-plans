require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const adminRoleRepository = require("../App/Infrastructure/MySQLRepository/AdminRoleRepository");
const AdminRole = require("../App/Domain/Core/AdminRole/AdminRole");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== AdminRole Test Cases ========= */

describe("AdminRoles", () => {
  const adminRole = AdminRole.createFromObject(demoObj.adminRoleObj);

  before(async () => {
    await adminRoleRepository.remove(adminRole);
  });

  after(async () => {
    await adminRoleRepository.remove(adminRole);
  });

  describe("Add AdminRole", () => {
    it("Should Add AdminRole", async () => {
      const addResult = await adminRoleRepository.add(adminRole);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All AdminRoles", async () => {
      const options = new PaginationOptions();
      const result = await adminRoleRepository.fetchAll(options);
      const adminRoles = result.getPaginatedData();
      adminRoles.data.forEach(adminRole => {
        expect(adminRole).to.be.instanceOf(AdminRole);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch AdminRole By Id", async () => {
      const adminRole = await adminRoleRepository.fetchById(
        demoObj.adminRoleObj.adminRoleId
      );
      expect(adminRole).to.be.instanceOf(AdminRole);
    });
  });

  describe("Update", () => {
    it("Should Update AdminRole", async () => {
      adminRole.adminRole = "kuxh";
      const updateResult = await adminRoleRepository.update(adminRole);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove AdminRole", async () => {
      const removeResult = await adminRoleRepository.remove(adminRole);
      expect(removeResult).to.equal(true);
    });
  });
});
