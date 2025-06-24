require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const adminUserRepository = require("../App/Infrastructure/MySQLRepository/AdminUserRepository");
const adminRoleRepository = require("../App/Infrastructure/MySQLRepository/AdminRoleRepository");
const AdminUser = require("../App/Domain/Core/AdminUser/AdminUser");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");
const AdminRole = require("../App/Domain/Core/AdminRole/AdminRole");
const AuthService = require("../App/Infrastructure/Service/AuthService");

/* ========== AdminUser Test Cases ========= */

describe("AdminUsers", () => {
  const adminRole = AdminRole.createFromObject(demoObj.adminRoleObj);
  const adminUser = AdminUser.createFromObject(demoObj.adminUserObj);

  before(async () => {
    await adminRoleRepository.remove(adminRole);
    await adminUserRepository.remove(adminUser);
  });

  after(async () => {
    await adminRoleRepository.remove(adminRole);
    await adminUserRepository.remove(adminUser);
  });

  describe("Add AdminUser", () => {
    it("Should Add AdminUser", async () => {
      await adminRoleRepository.add(adminRole);
      const hashedPassword = await AuthService.hashPassword(
        demoObj.adminUserObj.password
      );
      adminUser.setPassword(hashedPassword);
      const addResult = await adminUserRepository.add(adminUser);
      expect(addResult).to.equal(true);
    });
  });

  describe("FetchAll", () => {
    it("Should Fetch All AdminUsers", async () => {
      const options = new PaginationOptions();
      const result = await adminUserRepository.fetchAll(options);
      const adminUsers = result.getPaginatedData();
      adminUsers.data.forEach(adminUser => {
        expect(adminUser).to.be.instanceOf(AdminUser);
      });
    });
  });

  describe("FetchById", () => {
    it("Should Fetch AdminUser By Id", async () => {
      const adminUser = await adminUserRepository.fetchById(
        demoObj.adminUserObj.adminUserId
      );
      expect(adminUser).to.be.instanceOf(AdminUser);
    });
  });

  describe("Update", () => {
    it("Should Update AdminUser", async () => {
      adminUser.adminUser = "kuxh";
      const updateResult = await adminUserRepository.update(adminUser);
      expect(updateResult).to.equal(true);
    });
  });

  describe("Remove", () => {
    it("Should Remove AdminUser", async () => {
      const removeResult = await adminUserRepository.remove(adminUser);
      expect(removeResult).to.equal(true);
    });
  });
});
