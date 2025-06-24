const { Sequelize } = require('sequelize');

const tableName = 'campaigns';

const columnstoAdd = [
  { name: 'dateOnBoarded', type: Sequelize.DataTypes.DATE },
  { name: 'dateListingAgreementSigned', type: Sequelize.DataTypes.DATE },
  { name: 'exactDebtAmount', type: Sequelize.DataTypes.INTEGER },
];

const columnstoRemove = [
  { name: 'firstConversationDate', type: Sequelize.DataTypes.DATE },
  { name: 'termsAgreedUponDate', type: Sequelize.DataTypes.DATE },
  { name: 'dataOnBoarder', type: Sequelize.DataTypes.STRING },
];

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
