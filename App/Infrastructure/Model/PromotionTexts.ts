import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface PromotionTextAttributes {
  promotionTextId: string;
  configuration: any | null; // Or a more specific type for your JSON structure
}

// Extend Sequelize's Model class and implement our attributes interface
export class PromotionText
  extends Model<PromotionTextAttributes>
  implements PromotionTextAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public promotionTextId!: string;
  public configuration!: any | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  PromotionText.init(
    {
      // --- RUNTIME DEFINITIONS ---
      promotionTextId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      configuration: {
        type: DataTypes.JSON,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "PromotionText",
      tableName: "promotionTexts",
      timestamps: true,
      paranoid: true,
    }
  );

  return PromotionText;
};
