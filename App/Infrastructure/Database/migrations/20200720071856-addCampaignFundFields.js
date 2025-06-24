const { Sequelize } = require('sequelize');

const tableName = 'campaignFunds';

const columsntoAdd = [
  { name: 'investorAnnualIncome', type: Sequelize.DataTypes.FLOAT },
  { name: 'investorNetWorth', type: Sequelize.DataTypes.FLOAT },
  {
    name: 'investmentType',
    type: Sequelize.DataTypes.STRING,
  },
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
              { type: column.type },
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
