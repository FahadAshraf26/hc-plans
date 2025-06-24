import { Model, DataTypes, Sequelize } from "sequelize";
// import { Investor } from './Investor'; // Placeholder for import
// import { Campaign } from './Campaign'; // Placeholder for import

// Interface for type-safety on instance attributes
interface RepaymentAttributes {
  repaymentId: string;
  interest: number | null;
  principle: number | null;
  status: string | null;
  paymentType: string | null;
  total: number | null;
  accountName: string | null;
  importedAt: Date | null;
  dwollaTransferId: string | null;
  uploadId: string | null;
  investorId?: string; // Foreign Key
  campaignId?: string; // Foreign Key
}

// Extend Sequelize's Model class and implement our attributes interface
export class Repayment
  extends Model<RepaymentAttributes>
  implements RepaymentAttributes
{
  // --- TYPE DEFINITIONS ---
  public repaymentId!: string;
  public interest!: number | null;
  public principle!: number | null;
  public status!: string | null;
  public paymentType!: string | null;
  public total!: number | null;
  public accountName!: string | null;
  public importedAt!: Date | null;
  public dwollaTransferId!: string | null;
  public uploadId!: string | null;

  // Foreign Keys
  public investorId!: string;
  public campaignId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `RepaymentModel` is replaced with `this`, and
    // associated model names are updated to their v6 class names.
    models.Investor.hasMany(this, {
      foreignKey: "investorId",
      as: "investorRepayment",
    });

    models.Campaign.hasMany(this, {
      foreignKey: "campaignId",
      as: "campaignRepayment",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  Repayment.init(
    {
      // --- RUNTIME DEFINITIONS ---
      repaymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      interest: {
        type: DataTypes.FLOAT,
      },
      principle: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.STRING,
      },
      paymentType: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.FLOAT,
      },
      accountName: {
        type: DataTypes.STRING,
      },
      importedAt: {
        type: DataTypes.DATE,
      },
      dwollaTransferId: {
        type: DataTypes.STRING,
      },
      uploadId: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Repayment",
      tableName: "repayments", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Repayment;
};
