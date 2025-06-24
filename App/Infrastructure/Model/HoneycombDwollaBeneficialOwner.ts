import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class HoneycombDwollaBeneficialOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `HoneycombDwollaBeneficialOwnerModel` is replaced with `this`, and
      // the associated model names are updated to their v6 class names.
      this.belongsTo(models.Owner, {
        foreignKey: "ownerId",
        as: "owner",
      });
      this.belongsTo(models.HoneycombDwollaCustomer, {
        foreignKey: "dwollaCustomerId",
      });
    }
  }

  // Initialize the model with its attributes and options
  HoneycombDwollaBeneficialOwner.init(
    {
      // --- Attributes Definition ---
      honeycombDwollaBeneficialOwnerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      dwollaBeneficialOwnerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Foreign keys for 'ownerId' and 'dwollaCustomerId' will be added automatically
      // by the associations defined above.
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "HoneycombDwollaBeneficialOwner",
      tableName: "honeycombDwollaBeneficialOwners", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return HoneycombDwollaBeneficialOwner;
};
