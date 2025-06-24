const { Sequelize } = require('sequelize');

const tableName = 'campaignEscrowBanks';

const columnstoAdd = [
  { name: 'emailContact', type: Sequelize.DataTypes.STRING, allowNull: false },
];

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then((tableDefinition) => {
        return Promise.all([
          ...columnstoAdd.map((column) => {
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
        ]);
      });
    });
  },
};
