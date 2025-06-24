import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface UncaughtExceptionAttributes {
  uncaughtExceptionId: string;
  message: string;
  type: string;
  data: any; // Or a more specific type for your JSON structure
}

// Extend Sequelize's Model class and implement our attributes interface
export class UncaughtException
  extends Model<UncaughtExceptionAttributes>
  implements UncaughtExceptionAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public uncaughtExceptionId!: string;
  public message!: string;
  public type!: string;
  public data!: any;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  UncaughtException.init(
    {
      // --- RUNTIME DEFINITIONS ---
      uncaughtExceptionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "UncaughtException",
      tableName: "uncaughtExceptions", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return UncaughtException;
};
