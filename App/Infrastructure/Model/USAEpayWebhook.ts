import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface UsaEpayWebhookAttributes {
  webhookId: string;
  webhookType: string | null;
  status: string | null;
  payload: any | null; // Or a more specific type for your JSON structure
}

// Extend Sequelize's Model class and implement our attributes interface
export class UsaEpayWebhook
  extends Model<UsaEpayWebhookAttributes>
  implements UsaEpayWebhookAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public webhookId!: string;
  public webhookType!: string | null;
  public status!: string | null;
  public payload!: any | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  UsaEpayWebhook.init(
    {
      // --- RUNTIME DEFINITIONS ---
      webhookId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      webhookType: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      payload: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "UsaEpayWebhook",
      tableName: "usaEpayWebhooks", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return UsaEpayWebhook;
};
