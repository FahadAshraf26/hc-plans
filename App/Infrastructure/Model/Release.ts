'use strict';
export default (sequelize, DataTypes) => {
  const ReleaseModel = sequelize.define(
    'release',
    {
      releaseId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return ReleaseModel;
};
