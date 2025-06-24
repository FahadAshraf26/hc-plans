const demoObj = require('../../demoObj');

const user = {
  ...demoObj.userObj,
  investor: {
    ...demoObj.investorObj,
  },
  AccreditationStatus: () => {
    return true;
  },
  markAsAccreditated: () => {
    user.investor.isAccredited = 'Accredited';
  },
  getFullName: () => {
    return user.firstName + ' ' + user.lastName;
  },
  InvestorId: () => {
    return user.investor.investorId;
  },
};

module.exports = {
  user,
};
