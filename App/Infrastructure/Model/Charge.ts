const { Sequelize } = require('sequelize');

export default (sequelize, DataTypes) => {
  const ChargeModel = sequelize.define(
    'charge',
    {
      chargeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      chargeType: {
        type: DataTypes.STRING,
      },
      dwollaChargeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chargeStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      applicationFee: {
        type: DataTypes.STRING,
      },
      refunded: {
        type: DataTypes.BOOLEAN,
      },
      refundRequestDate: {
        type: DataTypes.DATE,
      },
      refundChargeId: {
        type: DataTypes.STRING,
      },
      referenceNumber: {
        type: DataTypes.STRING,
      },
      documentSent:{
        type:DataTypes.DATE,
      }
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  ChargeModel.associate = (models) => {
    ChargeModel.hasOne(ChargeModel, {
      foreignKey: {
        name: 'refundChargeId',
        allowNull: true,
      },
      as: 'parentCharge',
      useJunctionTable: false,
    });
  };

  return ChargeModel;
};
