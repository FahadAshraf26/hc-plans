'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('globalHoneycombConfigurations', [
      {
        globalHoneycombConfigurationId: '577bb296-78cc-481c-b317-740293b46e68',
        configuration: JSON.stringify({ isChargeFee: true, isSendFINRAEmails: false }),
        createdAt: '2021-10-20 15:25:03',
        updatedAt: '2021-10-20 15:25:03',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('globalHoneycombConfigurations', null, {});
  },
};
