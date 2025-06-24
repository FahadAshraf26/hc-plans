export default (sequelize, DataTypes) => {
  const AdminRoleModel = sequelize.define(
    'adminRole',
    {
      adminRoleId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
    },
    {
      timestamps: true,
    },
  );

  return AdminRoleModel;
};
