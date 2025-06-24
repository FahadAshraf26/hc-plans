import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class HoneycombDwollaCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Note: `HoneycombDwollaCustomerModel` is replaced with `this`, and
      // the associated model names are updated to their v6 class names.
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });

      this.belongsTo(models.Issuer, {
        foreignKey: "issuerId",
      });

      this.hasOne(models.HoneycombDwollaBeneficialOwner, {
        foreignKey: "dwollaCustomerId",
      });
    }
  }

  // Initialize the model with its attributes and options
  HoneycombDwollaCustomer.init(
    {
      // --- Attributes Definition ---
      honeycombDwollaCustomerId: {
        type: DataTypes.STRING,
      },
      dwollaCustomerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      customerType: {
        type: DataTypes.STRING,
      },
      isController: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isAccountAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dwollaBalanceId: {
        type: DataTypes.STRING,
      },
      dwollaDocumentId: {
        type: DataTypes.STRING,
      },
      // Foreign keys for 'userId' and 'issuerId' will be added automatically
      // by the associations defined above.
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "HoneycombDwollaCustomer",
      tableName: "honeycombDwollaCustomers", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return HoneycombDwollaCustomer;
};
