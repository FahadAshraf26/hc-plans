'use strict';

const { Sequelize } = require('sequelize');

const columnsToModify = [
  { tableName: 'issuers', name: 'description', type: Sequelize.DataTypes.TEXT },
  {
    tableName: 'issuers',
    name: 'fundRaisePurpose',
    type: Sequelize.DataTypes.TEXT,
  },
  {
    tableName: 'campaigns',
    name: 'useOfProceeds',
    type: Sequelize.DataTypes.TEXT,
  },
  {
    tableName: 'investors',
    name: 'annualIncome',
    type: Sequelize.DataTypes.BIGINT,
  },
  {
    tableName: 'investors',
    name: 'netWorth',
    type: Sequelize.DataTypes.BIGINT,
  },
  {
    tableName: 'investors',
    name: 'userProvidedCurrentInvestments',
    type: Sequelize.DataTypes.BIGINT,
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(
        columnsToModify.map(async (column) => {
          const { name, tableName, ...rest } = column;

          const tableDefinition = await queryInterface.describeTable(tableName);
          if (!tableDefinition[column.name]) {
            return Promise.resolve();
          }

          return queryInterface.changeColumn(tableName, name, rest, {
            transaction: t,
          });
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
