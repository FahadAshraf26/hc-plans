require('dotenv').config();

const chai = require('chai');
const expect = chai.expect;
const userRepository = require('../App/Infrastructure/MySQLRepository/UserRepository');
const User = require('../App/Domain/Core/User/User');
const ProfilePic = require('../App/Domain/Core/ProfilePic/ProfilePic');
const Owner = require('../App/Domain/Core/Owner/Owner');
const Investor = require('../App/Domain/Core/Investor/Investor');
const demoObj = require('../test/Helper/demoObj');
const PaginationOptions = require('../App/Domain/Utils/PaginationOptions');

/* ========== User Test Cases ========= */

describe('Users', () => {
  const user = User.createFromObject(demoObj.userObj);
  user.setPassword(demoObj.userObj.password);

  const profilePic = ProfilePic.createFromObject(demoObj.profilePicObj);
  const owner = Owner.createFromObject(demoObj.ownerObj);
  const investor = Investor.createFromObject(demoObj.investorObj);

  user.setProfilePic(profilePic);
  user.setOwner(owner);
  user.setInvestor(investor);
  before(async () => {
    await userRepository.remove(user, true);
  });

  after(async () => {
    await userRepository.remove(user, true);
  });

  describe('Add User', () => {
    it('Should Add User', async () => {
      const addResult = await userRepository.add(user);
      expect(addResult).to.equal(true);
    });
  });

  describe('FetchAllwithDeleted', () => {
    it('Should Fetch All Users', async () => {
      const options = new PaginationOptions();
      const users = await userRepository.fetchAll(options, {
        showTrashed: true,
      });
      const userObj = users.getPaginatedData();
      userObj.data.forEach((user) => {
        expect(user).to.be.instanceOf(User);
        if (user.profilePic) {
          expect(user.profilePic).to.be.instanceOf(ProfilePic);
        }
        if (user.owner) {
          expect(user.owner).to.be.instanceOf(Owner);
        }
        if (user.investor) {
          expect(user.investor).to.be.instanceOf(Investor);
        }
      });
    });
  });

  describe('FetchAll', () => {
    it('Should Fetch All Users', async () => {
      const options = new PaginationOptions();
      const users = await userRepository.fetchAll(options, {});
      const userObj = users.getPaginatedData();
      userObj.data.forEach((user) => {
        expect(user).to.be.instanceOf(User);
        if (user.profilePic) {
          expect(user.profilePic).to.be.instanceOf(ProfilePic);
        }
        if (user.owner) {
          expect(user.owner).to.be.instanceOf(Owner);
        }
        if (user.investor) {
          expect(user.investor).to.be.instanceOf(Investor);
        }
      });
    });
  });
  describe('FetchById', () => {
    it('Should Fetch User By Id', async () => {
      const user = await userRepository.fetchById(demoObj.userObj.userId);
      expect(user).to.be.instanceOf(User);

      if (user.profilePic) {
        expect(user.profilePic).to.be.instanceOf(ProfilePic);
      }

      if (user.owner) {
        expect(user.owner).to.be.instanceOf(Owner);
      }

      if (user.investor) {
        expect(user.investor).to.be.instanceOf(Investor);
      }
    });
  });

  describe('FetchByEmail', () => {
    it('Should Fetch User By Email', async () => {
      const user = await userRepository.fetchByEmail(demoObj.userObj.email);
      expect(user).to.be.instanceOf(User);
    });
  });

  describe('FetchAllByUserWithKyc', () => {
    it('Should Fetch All Users With Kyc', async () => {
      const options = new PaginationOptions();
      const result = await userRepository.fetchUserWithkyc(user.userId, options, {});
      const users = result.getPaginatedData();
      users.data.forEach((user) => {
        expect(user).to.be.instanceOf(User);
      });
    });
  });

  describe('Update', () => {
    it('Should Update User', async () => {
      user.userName = 'dd55';
      profilePic.name = 'pic';
      user.profilePic = profilePic;
      const updateResult = await userRepository.update(user);
      expect(updateResult).to.equal(true);
    });
  });

  describe('Remove', () => {
    it('Should Remove User', async () => {
      const removeResult = await userRepository.remove(user, false);
      expect(removeResult).to.equal(true);
    });
  });
});
