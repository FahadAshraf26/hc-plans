const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'investorBanks';

const columnstoAdd = [
  {
    tableName: 'campaignFunds',
    name: 'investorPaymentOptionsId',
    type: DataTypes.STRING,
  },
];

const customQueries = [
  `alter table ${tableName} ADD FOREIGN KEY payment_option_bank(investorPaymentOptionsId) REFERENCES investorPaymentOptions(investorPaymentOptionsId) ON DELETE CASCADE;`,
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
              column.tableName,
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
