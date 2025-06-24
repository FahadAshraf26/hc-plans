const chai = require('chai');
const expect = chai.expect;
const demoObj = require('../../Helper/Fixtures/users/initiateAccretitationFixture');
const InitiateAccreditationDTO = require('../../../App/Application/User/initiateAccreditation/InitiateAccreditationDTO');
const InitiateAccreditationUseCase = require('../../../App/Application/User/initiateAccreditation/InitiateAccreditationUseCase');
const initiateAccreditationUseCase = new InitiateAccreditationUseCase(
  {
    fetchById: async (id) => demoObj.user,
    update: async (user) => {
      return true;
    },
  },
  {
    add: async (investorAccreditation) => {
      return true;
    },
  },
  {},
  {
    updateAccount: async (ncAccountId, ip, fullName, accreditationStatus) => {
      return true;
    },
  },
);

describe('Testing initiate Accreditation Usecase', () => {
  let initiateAccreditationDTO;

  before(() => {
    initiateAccreditationDTO = new InitiateAccreditationDTO(
      demoObj.user.userId,
      '127.0.1.1',
    );
  });

  it('will check when user is already accredited', async () => {
    try {
      await initiateAccreditationUseCase.execute(initiateAccreditationDTO);
    } catch (err) {
      expect(err);
    }
  });

  it('will check when user is not accredited', async () => {
    demoObj.user.AccreditationStatus = () => {
      return false;
    };

    await initiateAccreditationUseCase.execute(initiateAccreditationDTO);
  });
});
