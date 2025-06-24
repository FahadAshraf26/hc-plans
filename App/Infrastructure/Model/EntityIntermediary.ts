import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class EntityIntermediary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `EntityIntermediaryModel` is replaced with `this`, and
      // the associated model names are updated to their v6 class names.
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });
    }
  }

  // Initialize the model with its attributes and options
  EntityIntermediary.init(
    {
      // --- Attributes Definition ---
      entityIntermediaryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      operatorAgreementApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      intermediaryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "EntityIntermediary",
      tableName: "entityIntermediaries", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return EntityIntermediary;
};
