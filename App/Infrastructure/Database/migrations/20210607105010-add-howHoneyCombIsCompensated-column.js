const { Sequelize } = require('sequelize');

const tableName = 'campaigns';

const columsntoAdd = [
  { name: 'howHoneycombIsCompensated', type: Sequelize.DataTypes.TEXT },
];

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all(
          columsntoAdd.map((column) => {
            if (tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.addColumn(
              tableName,
              column.name,
              {
                type: column.type,
                defaultValue: false,
              },
              { transaction: t },
            );
          }),
        );
      });
    });
  },
  down: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all(
          columsntoAdd.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.removeColumn(tableName, column.name, {
              transaction: t,
            });
          }),
        );
      });
    });
  },
};
