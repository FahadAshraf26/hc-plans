import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface RepaymentsUpdateAttributes {
  repaymentsUpdateId: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class RepaymentsUpdate
  extends Model<RepaymentsUpdateAttributes>
  implements RepaymentsUpdateAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public repaymentsUpdateId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  RepaymentsUpdate.init(
    {
      // --- RUNTIME DEFINITIONS ---
      repaymentsUpdateId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "RepaymentsUpdate",
      tableName: "repaymentsUpdates", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return RepaymentsUpdate;
};
