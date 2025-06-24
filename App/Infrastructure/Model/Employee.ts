import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: All `...Model` suffixes have been removed from the model names
      // and `EmployeeModel` is replaced with `this`.

      // Defines the relationship from the perspective of the other model
      models.Issuer.hasMany(this, {
        foreignKey: "issuerId",
      });

      // Defines the relationship from this model's perspective
      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });
    }
  }

  // Initialize the model with its attributes and options
  Employee.init(
    {
      // --- Attributes Definition ---
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
      // --- Model Options ---
      sequelize,
      modelName: "Employee",
      tableName: "employees", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Employee;
};
