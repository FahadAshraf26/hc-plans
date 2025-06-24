export default (sequelize, DataTypes) => {
  const EmployeeModel = sequelize.define(
    'employee',
    {
      employeeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedIn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  EmployeeModel.associate = (models) => {
    models.IssuerModel.hasMany(EmployeeModel, {
      foreignKey: 'issuerId',
    });

    EmployeeModel.belongsTo(models.IssuerModel, {
      foreignKey: 'issuerId',
    });
  };

  return EmployeeModel;
};
