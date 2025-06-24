require('dotenv').config();

const chai = require('chai');
const expect = chai.expect;
const userMediaRepository = require('../App/Infrastructure/MySQLRepository/UserMediaRepository');
const UserMedia = require('../App/Domain/Core/UserMedia');
const User = require('../App/Domain/Core/User/User');
const demoObj = require('./Helper/UserMediaFixture');
const PaginationOptions = require('../App/Domain/Utils/PaginationOptions');
const UserRepository = require('../App/Infrastructure/MySQLRepository/UserRepository');

/* ========== UserMedia Test Cases ========= */

describe('UserMedias', () => {
  const user = User.createFromObject(demoObj.userMediaObj.user);
  user.setPassword('12345');
  const userMedia = UserMedia.createFromObject(demoObj.userMediaObj);

  before(async () => {
    await UserRepository.remove(user, true);
    await userMediaRepository.remove(userMedia, true);
  });

  after(async () => {
    await UserRepository.remove(user, true);

    await userMediaRepository.remove(userMedia, true);
  });

  describe('Add UserMedia', () => {
    it('Should Add UserMedia', async () => {
      await UserRepository.add(user);
      const addResult = await userMediaRepository.add(userMedia);
      expect(addResult).to.equal(true);
    });
  });

  describe('FetchAllwithDeleted', () => {
    it('Should Fetch All UserMedias', async () => {
      const options = new PaginationOptions();
      const result = await userMediaRepository.fetchAll(options, true);
      const userMedias = result.getPaginatedData();
      userMedias.data.forEach((userMedia) => {
        expect(userMedia).to.be.instanceOf(UserMedia);
      });
    });
  });

  describe('FetchAll', () => {
    it('Should Fetch All UserMedias', async () => {
      const options = new PaginationOptions();
      const result = await userMediaRepository.fetchAll(options, {});
      const userMedias = result.getPaginatedData();
      userMedias.data.forEach((userMedia) => {
        expect(userMedia).to.be.instanceOf(UserMedia);
      });
    });
  });

  describe('FetchById', () => {
    it('Should Fetch UserMedia By Id', async () => {
      const userMedia = await userMediaRepository.fetchById(
        demoObj.userMediaObj.userMediaId,
      );
      expect(userMedia).to.be.instanceOf(UserMedia);
    });
  });

  describe('Update', () => {
    it('Should Update UserMedia', async () => {
      userMedia.userMedia = 'kuxh';
      const updateResult = await userMediaRepository.update(userMedia);
      expect(updateResult).to.equal(true);
    });
  });

  describe('Remove', () => {
    it('Should Remove UserMedia', async () => {
      const removeResult = await userMediaRepository.remove(userMedia);
      expect(removeResult).to.equal(true);
    });
  });
});
