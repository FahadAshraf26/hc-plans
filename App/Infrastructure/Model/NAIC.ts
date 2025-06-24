import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface NaicAttributes {
  naicId: number;
  code: string | null;
  title: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class Naic extends Model<NaicAttributes> implements NaicAttributes {
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public naicId!: number;
  public code!: string | null;
  public title!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  // This model is not paranoid, so no deletedAt

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
  // The relationship is likely defined in another model (e.g., Issuer.belongsTo(Naic)).
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  Naic.init(
    {
      // --- RUNTIME DEFINITIONS ---
      naicId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Naic",
      tableName: "naics", // Explicitly set table name
      timestamps: true,
      // paranoid: false is the default
    }
  );

  return Naic;
};
