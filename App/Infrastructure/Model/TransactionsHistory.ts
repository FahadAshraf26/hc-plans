import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface TransactionsHistoryAttributes {
  transactionsHistoryId: string;
  cashFlowStatus: string | null;
  dwollaTransferId: string | null;
  campaignName: string | null;
  userId: string | null;
  amount: number | null;
  transferStatus: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class TransactionsHistory
  extends Model<TransactionsHistoryAttributes>
  implements TransactionsHistoryAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public transactionsHistoryId!: string;
  public cashFlowStatus!: string | null;
  public dwollaTransferId!: string | null;
  public campaignName!: string | null;
  public userId!: string | null;
  public amount!: number | null;
  public transferStatus!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  TransactionsHistory.init(
    {
      // --- RUNTIME DEFINITIONS ---
      transactionsHistoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      cashFlowStatus: {
        type: DataTypes.STRING,
      },
      dwollaTransferId: {
        type: DataTypes.STRING,
      },
      campaignName: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      transferStatus: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "TransactionsHistory",
      tableName: "transactionsHistories",
      timestamps: true,
      paranoid: true,
    }
  );

  return TransactionsHistory;
};
