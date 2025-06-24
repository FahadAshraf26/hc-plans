'use strict';

const { Sequelize } = require('sequelize');

const columnsToModify = [
  {
    tableName: 'campaignInfos',
    name: 'financialHistory',
    type: Sequelize.DataTypes.TEXT,
  },
  {
    tableName: 'campaignInfos',
    name: 'competitors',
    type: Sequelize.DataTypes.TEXT,
  },
  {
    tableName: 'campaignInfos',
    name: 'milestones',
    type: Sequelize.DataTypes.TEXT,
  },
  {
    tableName: 'campaignInfos',
    name: 'risks',
    type: Sequelize.DataTypes.TEXT,
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      columnsToModify.map((item) => {
        const { tableName, name, ...rest } = item;
        return queryInterface.changeColumn(tableName, name, rest);
      }),
    );
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
