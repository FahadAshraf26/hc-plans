import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface InvestorPaymentOptionAttributes {
  investorPaymentOptionsId: string;
  type: string;
  investorId?: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class InvestorPaymentOption
  extends Model<InvestorPaymentOptionAttributes>
  implements InvestorPaymentOptionAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public investorPaymentOptionsId!: string;
  public type!: string;

  // This foreign key is added by the association
  public investorId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: All `...Model` suffixes have been removed from the model names
    // and `InvestorPaymentOptionsModel` is replaced with `this`.
    this.hasOne(models.InvestorCard, {
      foreignKey: "investorPaymentOptionsId",
      as: "card",
    });

    this.belongsTo(models.Investor, {
      foreignKey: "investorId",
    });

    models.Investor.hasMany(this, {
      foreignKey: "investorId",
      // Note: The alias 'investorBank' was likely a copy-paste error.
      // Renamed to 'paymentOptions' for clarity.
      as: "paymentOptions",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  InvestorPaymentOption.init(
    {
      // --- RUNTIME DEFINITIONS ---
      investorPaymentOptionsId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "InvestorPaymentOption",
      tableName: "investorPaymentOptions", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return InvestorPaymentOption;
};
