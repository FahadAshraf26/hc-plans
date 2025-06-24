import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  // Define the model class using PascalCase
  class Charge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of the Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Defines the self-referencing relationship for parent-child hierarchies (e.g., a charge and its refund charge).
      // `ChargeModel` is replaced with `this` to refer to the current class.
      this.hasOne(this, {
        foreignKey: {
          name: "refundChargeId",
          allowNull: true,
        },
        as: "parentCharge",
      });

      // It's often helpful to define the inverse relationship as well
      this.belongsTo(this, {
        foreignKey: "refundChargeId",
        as: "refund",
      });
    }
  }

  // Initialize the model with its attributes and options
  Charge.init(
    {
      // --- Attributes Definition ---
      chargeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      chargeType: {
        type: DataTypes.STRING,
      },
      dwollaChargeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chargeStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      applicationFee: {
        type: DataTypes.STRING,
      },
      refunded: {
        type: DataTypes.BOOLEAN,
      },
      refundRequestDate: {
        type: DataTypes.DATE,
      },
      refundChargeId: {
        type: DataTypes.STRING,
      },
      referenceNumber: {
        type: DataTypes.STRING,
      },
      documentSent: {
        type: DataTypes.DATE,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Charge",
      tableName: "charges", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Charge;
};
