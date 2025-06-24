export default (sequelize, DataTypes) => {
  const AdminUserModel = sequelize.define(
    'adminUser',
    {
      adminUserId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      timestamps: true,
    },
  );

  AdminUserModel.associate = (models) => {
    AdminUserModel.belongsTo(models.AdminRoleModel, {
      foreignKey: 'adminRoleId',
      as: 'role',
      onDelete: 'cascade',
    });
  };

  return AdminUserModel;
};
