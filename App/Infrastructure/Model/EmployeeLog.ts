export default (sequelize, DataTypes) => {
  const EmployeeLogModel = sequelize.define(
    'employeeLog',
    {
      employeeLogId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      employeeCount: {
        type: DataTypes.INTEGER,
      },
      updatedEmployeeCount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );
  EmployeeLogModel.associate = (models) => {
    EmployeeLogModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });
  };
  return EmployeeLogModel;
};
