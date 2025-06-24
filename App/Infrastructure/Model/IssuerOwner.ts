export default (sequelize, DataTypes) => {
  const IssuerOwnerModel = sequelize.define(
    'issuerOwner',
    {
      issuerOwnerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return IssuerOwnerModel;
};
