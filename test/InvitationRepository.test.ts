require("dotenv").config();

const chai = require("chai");
const expect = chai.expect;
const invitationRepository = require("../App/Infrastructure/MySQLRepository/InvitationRepository");
const Invitation = require("../App/Domain/Core/Invitation");
const demoObj = require("./Helper/demoObj");
const User = require("../App/Domain/Core/User/User");
const UserRepository = require("../App/Infrastructure/MySQLRepository/UserRepository");
const PaginationOptions = require("../App/Domain/Utils/PaginationOptions");

/* ========== Invitation Test Cases ========= */

describe("Invitations", () => {
    const user = User.createFromObject(demoObj.userObj);
    user.setPassword(demoObj.userObj.password);
    const invitation = Invitation.createFromObject(demoObj.invitationObj);

    before(async () => {
        await UserRepository.remove(user, true);
        await invitationRepository.remove(invitation, true);
    });

    after(async () => {
        await UserRepository.remove(user, true);
        await invitationRepository.remove(invitation, true);
    });

    describe("Add Invitation", () => {
        it("Should Add Invitation", async () => {
            await UserRepository.add(user);
            const addResult = await invitationRepository.add(invitation);
            expect(addResult).to.equal(true);
        });
    });

    describe("FetchAllWithDeleted", () => {
        it("Should Fetch All Invitations", async (page = 1) => {
            const options = new PaginationOptions();
            const result = await invitationRepository.fetchAll(options, true);
            const invitations = result.getPaginatedData();
            invitations.data.forEach(invitation => {
                expect(invitation).to.be.instanceOf(Invitation);
            });
        });
    });

    describe("FetchAll", () => {
        it("Should Fetch All Invitations", async (page = 1) => {
            const options = new PaginationOptions();
            const result = await invitationRepository.fetchAll(options);
            const invitations = result.getPaginatedData();
            invitations.data.forEach(invitation => {
                expect(invitation).to.be.instanceOf(Invitation);
            });
        });
    });

    describe("FetchById", () => {
        it("Should Fetch Invitation By Id", async () => {
            const invitationEntity = await invitationRepository.fetchById(
                invitation.invitationId
            );
            expect(invitationEntity).to.be.instanceOf(Invitation);
        });
    });

    describe("Update", () => {
        it("Should Update Invitation", async () => {
            invitation.setJoiningDate("12-12-12");
            const updateResult = await invitationRepository.update(invitation);
            expect(updateResult).to.equal(true);
        });
    });

    describe("Remove", () => {
        it("Should Remove Invitation", async () => {
            const removeResult = await invitationRepository.remove(invitation);
            expect(removeResult).to.equal(true);
        });
    });
});
