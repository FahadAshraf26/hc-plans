import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface LoanwellAttributes {
  loanwellId: string;
  name: string;
  importedBy: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class Loanwell
  extends Model<LoanwellAttributes>
  implements LoanwellAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public loanwellId!: string;
  public name!: string;
  public importedBy!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  Loanwell.init(
    {
      // --- RUNTIME DEFINITIONS ---
      loanwellId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      importedBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Loanwell",
      tableName: "loanwells", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Loanwell;
};
