require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const UserDocumentRepository = require("../App/Infrastructure/MySQLRepository/UserDocumentRepository");
const UserDocument = require("../App/Domain/Core/UserDocument");
const User = require("../App/Domain/Core/User/User");
const demoObj = require("./Helper/demoObj");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== User Documnet Test Cases ========= */

describe("UserDocuments", () => {
    const user = User.createFromObject(demoObj.userObj);
    user.setPassword(demoObj.userObj.password);
    const userDocument = UserDocument.createFromObject(demoObj.userDocumentObj);

    before(async () => {
        await UserRepository.remove(user, true);
        await UserDocumentRepository.remove(userDocument, true);
    });

    after(async () => {
        await UserRepository.remove(user, true);
        await UserDocumentRepository.remove(userDocument, true);
    });

    describe("Add User Document", () => {
        it("Should Add User", async () => {
            await UserRepository.add(user);
            const addResult = await UserDocumentRepository.add(userDocument);
            expect(addResult).to.equal(true);
        });
    });

    describe("FetchAllwithDeleted", () => {
        it("Should Fetch All Users", async () => {
            const options = new PaginationOptions();
            const result = await UserDocumentRepository.fetchAll(options, true);
            const users = result.getPaginatedData();
            users.data.forEach((user) => {
                expect(user).to.be.instanceOf(UserDocument);
            });
        });
    });

    describe("FetchAllByUser", () => {
        it("Should Fetch All Users Documents", async () => {
            const options = new PaginationOptions();
            const result = await UserDocumentRepository.fetchByUser(
                user.userId,
                options, {}
            );
            const users = result.getPaginatedData();
            users.data.forEach((user) => {
                expect(user).to.be.instanceOf(UserDocument);
            });
        });
    });

    describe("FetchAll", () => {
        it("Should Fetch All Users Documents", async () => {
            const options = new PaginationOptions();
            const result = await UserDocumentRepository.fetchAll(options);
            const users = result.getPaginatedData();
            users.data.forEach((user) => {
                expect(user).to.be.instanceOf(UserDocument);
            });
        });
    });

    describe("FetchById", () => {
        it("Should Fetch User document By Id", async () => {
            const user = await UserDocumentRepository.fetchById(
                userDocument.userDocumentId
            );
            expect(user).to.be.instanceOf(UserDocument);
        });
    });

    describe("Update", () => {
        it("Should Update User Document", async () => {
            userDocument.name = "kuxh";
            const updateResult = await UserDocumentRepository.update(userDocument);
            expect(updateResult).to.equal(true);
        });
    });

    describe("Remove", () => {
        it("Should Remove User document", async () => {
            const removeResult = await UserDocumentRepository.remove(
                userDocument,
                true
            );
            expect(removeResult).to.equal(true);
        });
    });
});
