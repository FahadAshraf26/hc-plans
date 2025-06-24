import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface InvestorPaymentsAttributes {
  investorPaymentsId: string;
  prorate: number | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class InvestorPayments
  extends Model<InvestorPaymentsAttributes>
  implements InvestorPaymentsAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public investorPaymentsId!: string;
  public prorate!: number | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
  // Relationships to this model (e.g., Investor.hasMany(InvestorPayments))
  // are defined in other models.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  InvestorPayments.init(
    {
      // --- RUNTIME DEFINITIONS ---
      investorPaymentsId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      prorate: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "InvestorPayments",
      tableName: "investorPayments",
      timestamps: true,
      paranoid: true,
    }
  );

  return InvestorPayments;
};
