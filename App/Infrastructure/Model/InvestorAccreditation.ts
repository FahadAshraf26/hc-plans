import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class InvestorAccreditation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `InvestorAccreditationModel` is replaced with `this`, and
      // `InvestorModel` is updated to its v6 class name.

      // Defines the relationship from the perspective of the other model
      models.Investor.hasMany(this, {
        foreignKey: "investorId",
        as: "investorAccreditation",
      });

      // Defines the relationship from this model's perspective
      this.belongsTo(models.Investor, {
        foreignKey: "investorId",
        as: "investor",
      });
    }
  }

  // Initialize the model with its attributes and options
  InvestorAccreditation.init(
    {
      // --- Attributes Definition ---
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
      // --- Model Options ---
      sequelize,
      modelName: "InvestorAccreditation",
      tableName: "investorAccreditations", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return InvestorAccreditation;
};
