import { Model, DataTypes, Sequelize } from "sequelize";
// import { InvestorPayments } from './InvestorPayments'; // Placeholder for import

// Interface for type-safety on instance attributes
interface ProjectionReturnsAttributes {
  projectionReturnsId: string;
  interest: number | null;
  principle: number | null;
  investorPaymentsId?: string; // Foreign Key
}

// Extend Sequelize's Model class and implement our attributes interface
export class ProjectionReturns
  extends Model<ProjectionReturnsAttributes>
  implements ProjectionReturnsAttributes
{
  // --- TYPE DEFINITIONS ---
  public projectionReturnsId!: string;
  public interest!: number | null;
  public principle!: number | null;

  // Foreign Key
  public investorPaymentsId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `ProjectionReturnsModel` is replaced with `this`, and
    // `InvestorPaymentsModel` is updated to its v6 class name.
    this.belongsTo(models.InvestorPayments, {
      foreignKey: "investorPaymentsId",
      as: "investorProjectionReturns",
    });

    models.InvestorPayments.hasMany(this, {
      foreignKey: "investorPaymentsId",
      as: "investorPaymentsProjections",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  ProjectionReturns.init(
    {
      // --- RUNTIME DEFINITIONS ---
      projectionReturnsId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      interest: {
        type: DataTypes.FLOAT,
      },
      principle: {
        type: DataTypes.FLOAT,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "ProjectionReturns",
      tableName: "projectionReturns", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return ProjectionReturns;
};
