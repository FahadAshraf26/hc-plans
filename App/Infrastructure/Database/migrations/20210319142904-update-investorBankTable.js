const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'investorBanks';

const columnstoAdd = [
  { name: 'bankName', type: Sequelize.DataTypes.STRING },
  { name: 'investorPaymentOptionsId', type: Sequelize.DataTypes.STRING },
];

const customQueries = [];

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
          ...customQueries.map((query) => queryInterface.sequelize.query(query)),
          ...columnstoRemove.map((column) => {
            if (!tableDefinition[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.removeColumn(tableName, column.name, {
              transaction: t,
            });
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
        ]);
      });
    });
  },
};
