const { Sequelize } = require('sequelize');

const DataTypes = Sequelize.DataTypes;
const tableName = 'campaigns';

const columnstoAdd = [
  { name: 'valuationCap', type: Sequelize.DataTypes.INTEGER },
  { name: 'discount', type: Sequelize.DataTypes.FLOAT },
];

const columnstoRemove = [
  {
    name: 'termCompleted',
    type: DataTypes.INTEGER,
  },
  {
    name: 'investorTable',
    type: DataTypes.STRING,
  },
  {
    name: 'paid_OffDate',
    type: DataTypes.DATE,
  },
  {
    name: 'escrowAmountReceivedSuccessfully',
    type: DataTypes.DATE,
  },
  {
    name: 'escrowOutgoingTransferDate',
    type: DataTypes.DATE,
  },
  {
    name: 'PPMFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'formCFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'formDFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'dateOnBoarded',
    type: DataTypes.DATE,
  },
  {
    name: 'dateListingAgreementSigned',
    type: DataTypes.DATE,
  },
  {
    name: 'collateral',
    type: DataTypes.STRING,
  },
  {
    name: 'exactDebtAmount',
    type: DataTypes.INTEGER,
  },
  {
    name: 'formC_UFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'formC_AFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'formC_ARFiledDate',
    type: DataTypes.DATE,
  },
  {
    name: 'legalEntityAtTimeOfOnboarding',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'activeRevenueAtTimeOfOnboarding',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'existingDebtAtTimeOfOnboarding',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'badActorInfoIdentityAtTimeOfOnboarding',
    type: DataTypes.BOOLEAN,
  },
  {
    name: 'applicationSubmissionDate',
    type: DataTypes.DATE,
  },
  {
    name: 'applicationReviewDate',
    type: DataTypes.DATE,
  },
  {
    name: 'badActorScreeningDate',
    type: DataTypes.DATE,
  },
  {
    name: 'offeringFillingDate',
    type: DataTypes.DATE,
  },
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
