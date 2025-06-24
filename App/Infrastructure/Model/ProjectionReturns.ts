export default (sequelize, DataTypes) => {
  const ProjectionReturnsModel = sequelize.define(
    'projectionReturns',
    {
      projectionReturnsId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      interest: {
        type: DataTypes.FLOAT,
      },
      principle: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  ProjectionReturnsModel.associate = (models) => {
    ProjectionReturnsModel.belongsTo(models.InvestorPaymentsModel, {
      foreignKey: 'investorPaymentsId',
      as: 'investorProjectionReturns',
    });

    models.InvestorPaymentsModel.hasMany(ProjectionReturnsModel, {
      foreignKey: 'investorPaymentsId',
      as: 'investorPaymentsProjections',
    });
  };

  return ProjectionReturnsModel;
};
