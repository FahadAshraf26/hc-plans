export default (sequelize, DataTypes) => {
  const InvestorAccreditationModel = sequelize.define(
    'investorAccreditation',
    {
      investorAccreditationId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      accreditationStatus: {
        type: DataTypes.STRING,
      },
      submissionDate: {
        type: DataTypes.DATEONLY,
      },
      result: {
        type: DataTypes.STRING,
      },
      resultDate: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  InvestorAccreditationModel.associate = (models) => {
    models.InvestorModel.hasMany(InvestorAccreditationModel, {
      foreignKey: 'investorId',
      as: 'investorAccreditation',
    });

    InvestorAccreditationModel.belongsTo(models.InvestorModel, {
      foreignKey: 'investorId',
      as: 'investor',
    });
  };

  return InvestorAccreditationModel;
};
