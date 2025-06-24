'use strict';

const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'tos';
const columnsToModify = [];

const columnsToAdd = [
  {
    name: 'termOfServicesUpdateDate',
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
  {
    name: 'privacyPolicyUpdateDate',
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
  {
    name: 'educationalMaterialUpdateDate',
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
  },
  { name: 'faqsUpdateDate', type: Sequelize.DataTypes.BOOLEAN, defaultValue: false },
];

const columnsTORename = [
  { oldName: 'termOfServicesUpdateDate', newName: 'termOfServicesUpdateDate_old' },
  { oldName: 'privacyPolicyUpdateDate', newName: 'privacyPolicyUpdateDate_old' },
  {
    oldName: 'educationalMaterialUpdateDate',
    newName: 'educationalMaterialUpdateDate_old',
  },
  { oldName: 'faqsUpdateDate', newName: 'faqsUpdateDate_old' },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface.describeTable(tableName).then(async (tableDefinition) => {
        await Promise.all(
          columnsTORename.map((column) => {
            if (tableDefinition[column.newName]) {
              return Promise.resolve();
            }

            return queryInterface.renameColumn(tableName, column.oldName, column.newName);
          }),
        );

        const td = await queryInterface.describeTable(tableName);
        return Promise.all([
          ...columnsToAdd.map((column) => {
            if (td[column.name]) {
              return Promise.resolve();
            }

            return queryInterface.addColumn(
              tableName,
              column.name,
              { type: column.type },
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
