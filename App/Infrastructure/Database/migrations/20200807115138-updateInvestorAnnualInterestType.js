'use strict';

const { Sequelize } = require('sequelize');

const tableName = 'campaigns';
const columnsToModify = [
  {
    name: 'annualInterestRate',
    type: Sequelize.DataTypes.FLOAT,
  },
];

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnsToModify.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }
            const { name, ...rest } = column;
            return queryInterface.changeColumn(tableName, name, rest);
          }),
        ]);
      });
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
