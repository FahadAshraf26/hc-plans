const demoObj = require('./demoObj');
const UserMediaType = require('../../App/Domain/Core/ValueObjects/UserMediaType');

const userMediaObj = {
  userMediaId: '1',
  name: UserMediaType.LICENSE,
  type: UserMediaType.LICENSE,
  uri: 'testPath',
  user: demoObj.userObj,
  userId: demoObj.userObj.userId,
};

module.exports = {
  userMediaObj,
};
