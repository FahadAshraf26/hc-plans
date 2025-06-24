const demoObj = require("./demoObj");

const investorBankObj = {
  investorBankId: "1",
  bankToken: "testToken",
  accountType: "checking",
  dwollaSourceId: "1",
  accountName: "test checking",
  investorId: demoObj.investorObj.investorId,
  lastFour: "0000",
  accountNumber: "00000000",
  routingNumber: "123456789",
  wireRoutingNumber: "123456789",
};

module.exports = {
  investorBankObj,
};
