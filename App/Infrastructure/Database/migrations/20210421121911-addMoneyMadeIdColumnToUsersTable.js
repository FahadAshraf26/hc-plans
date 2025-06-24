'use strict';

const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'users';

const columnsToAdd = [
  {
    name: 'moneyMadeId',
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnsToAdd.map((column) => {
            const { name, type, ...rest } = column;

            if (tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.addColumn(
              tableName,
              column.name,
              { type: column.type, ...rest },
              { transaction: t },
            );
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
