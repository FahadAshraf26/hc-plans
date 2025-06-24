const demoObj = require("./demoObj");

const issuerBankObj = {
  issuerBankId: "1",
  bankToken: "testToken",
  accountType: "checking",
  dwollaSourceId: "1",
  accountName: "test checking",
  issuerId: demoObj.issuerObj.issuerId,
  lastFour: "0000",
  accountNumber: "00000000",
  routingNumber: "123456789",
  wireRoutingNumber: "123456789",
};

module.exports = {
  issuerBankObj,
};
