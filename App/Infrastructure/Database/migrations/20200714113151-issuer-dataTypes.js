'use strict';

const { Sequelize } = require('sequelize');

const columnsToModify = [
  {
    tableName: 'issuers',
    name: 'stateOfFormation',
    type: Sequelize.DataTypes.STRING,
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
