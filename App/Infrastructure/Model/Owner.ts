import { Model, DataTypes, Sequelize } from "sequelize";
// import { HoneycombDwollaBeneficialOwner } from './HoneycombDwollaBeneficialOwner'; // Placeholder for import

// Interface for type-safety on instance attributes
interface OwnerAttributes {
  ownerId: string;
  title: string;
  subTitle: string | null;
  description: string;
  primaryOwner: boolean;
  beneficialOwner: boolean;
  beneficialOwnerId: string | null;
  businessOwner: boolean | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class Owner extends Model<OwnerAttributes> implements OwnerAttributes {
  // --- TYPE DEFINITIONS ---
  public ownerId!: string;
  public title!: string;
  public subTitle!: string | null;
  public description!: string;
  public primaryOwner!: boolean;
  public beneficialOwner!: boolean;
  public beneficialOwnerId!: string | null;
  public businessOwner!: boolean | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // --- STATIC ASSOCIATE METHOD ---
  public static associate(models: any) {
    // Note: `OwnerModel` is replaced with `this`, and the associated
    // model name is updated to its v6 class name.
    this.hasOne(models.HoneycombDwollaBeneficialOwner, {
      foreignKey: "ownerId",
      as: "dwollaBeneficialOwner",
    });
  }
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  Owner.init(
    {
      // --- RUNTIME DEFINITIONS ---
      ownerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subTitle: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      primaryOwner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      beneficialOwner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      beneficialOwnerId: {
        type: DataTypes.STRING,
      },
      businessOwner: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "Owner",
      tableName: "owners", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return Owner;
};
