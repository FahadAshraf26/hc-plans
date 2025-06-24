'use strict';

const { Sequelize } = require('sequelize');

const tableName = 'campaigns';
const columnsToModify = [
  {
    tableName: 'campaigns',
    name: 'campaignExpirationDate',
    type: Sequelize.DataTypes.DATEONLY,
  },
  {
    tableName: 'campaigns',
    name: 'maturityDate',
    type: Sequelize.DataTypes.DATEONLY,
  },
  {
    tableName: 'campaigns',
    name: 'repaymentStartDate',
    type: Sequelize.DataTypes.DATEONLY,
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then((tableDefinition) => {
      return Promise.all(
        columnsToModify.map((item) => {
          if (!tableDefinition[item.name]) {
            return Promise.resolve();
          }
          const { tableName, name, ...rest } = item;
          return queryInterface.changeColumn(tableName, name, rest);
        }),
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
