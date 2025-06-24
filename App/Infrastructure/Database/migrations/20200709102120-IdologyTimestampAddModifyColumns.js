const { Sequelize } = require('sequelize');

const tableName = 'idologyTimestamps';

const columnstoAdd = [
  { name: 'idologyScanUrlExpirationTime', type: Sequelize.DataTypes.DATE },
  { name: 'idologyScanUrl', type: Sequelize.DataTypes.STRING },
  { name: 'idologyIdNumber', type: Sequelize.DataTypes.STRING },
  { name: 'badActorFlagged', type: Sequelize.DataTypes.BOOLEAN },
  { name: 'isResultMatched', type: Sequelize.DataTypes.BOOLEAN },
];

const columnsToModify = [
  {
    name: 'isVerified',
    type: Sequelize.DataTypes.STRING,
    previous: Sequelize.DataTypes.BOOLEAN,
  },
];

const columnstoRemove = [];

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnstoAdd.map((column) => {
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
          ...columnstoRemove.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.removeColumn(tableName, column.name, {
              transaction: t,
            });
          }),
          ...columnsToModify.map((column) => {
            const { name, previous, ...rest } = column;

            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.changeColumn(tableName, name, rest);
          }),
        ]);
      });
    });
  },
  down: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnstoAdd.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.removeColumn(tableName, column.name, {
              transaction: t,
            });
          }),
          ...columnstoRemove.map((column) => {
            if (tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.addColumn(
              tableName,
              column.name,
              { type: column.type },
              {
                transaction: t,
              },
            );
          }),
          ...columnsToModify.map((column) => {
            const { name, type, ...rest } = column;

            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.changeColumn(tableName, name, {
              type: rest.previous,
            });
          }),
        ]);
      });
    });
  },
};
