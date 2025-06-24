export default (sequelize, DataTypes) => {
  const CapitalRequestModel = sequelize.define(
    'capitalRequest',
    {
      capitalRequestId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      capitalRequired: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capitalReason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return CapitalRequestModel;
};
