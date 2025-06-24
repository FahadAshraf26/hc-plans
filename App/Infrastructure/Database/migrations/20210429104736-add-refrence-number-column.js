'use strict';

const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'charges';
const columnsToModify = [];

const columnsToAdd = [
  {
    name: 'referenceNumber',
    type: DataTypes.STRING,
    allowNull: true,
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnsToAdd.map((column) => {
            if (tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.addColumn(
              tableName,
              column.name,
              { type: column.type },
              { transaction: t },
            );
          }),
          ...columnsToModify.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }
            const { name, ...rest } = column;
            return queryInterface.changeColumn(tableName, name, rest, {
              transaction: t,
            });
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
