export default (sequelize, DataTypes) => {
  const LoanwellModel = sequelize.define(
    'loanwell',
    {
      loanwellId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      importedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  return LoanwellModel;
};
