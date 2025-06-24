import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class AdminUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Define the 'belongsTo' association
      // Note: The target model is now 'models.AdminRole' to match v6 naming conventions.
      this.belongsTo(models.AdminRole, {
        foreignKey: "adminRoleId",
        as: "role",
        onDelete: "cascade", // This option is carried over directly
      });
    }
  }

  // Initialize the model with its attributes and options
  AdminUser.init(
    {
      // --- Attributes ---
      adminUserId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        // You might want to add constraints here, e.g.,
        // unique: true,
        // allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
    },
    {
      // --- Options ---

      // Pass the Sequelize connection instance
      sequelize,

      // Set the model name
      modelName: "AdminUser",

      // Explicitly set the table name in the database as requested
      tableName: "adminUsers",

      // Enable timestamps (createdAt, updatedAt)
      timestamps: true,
    }
  );

  return AdminUser;
};
