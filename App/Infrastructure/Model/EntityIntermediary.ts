export default (sequelize, DataTypes) => {
  const EntityIntermediaryModel = sequelize.define(
    'entityIntermediary',
    {
      entityIntermediaryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      operatorAgreementApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      intermediaryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  EntityIntermediaryModel.associate = (models) => {
    EntityIntermediaryModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
    });
    EntityIntermediaryModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });
  };
  return EntityIntermediaryModel;
};
