import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface IssuerOwnerAttributes {
  issuerOwnerId: string;
  remarks: string | null;
  // Foreign keys for 'issuerId' and 'ownerId' will be added by associations
  issuerId?: string;
  ownerId?: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class IssuerOwner
  extends Model<IssuerOwnerAttributes>
  implements IssuerOwnerAttributes
{
  // --- TYPE DEFINITIONS ---
  public issuerOwnerId!: string;
  public remarks!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This is a junction table model. The associations involving it
  // (e.g., Issuer.belongsToMany(Owner, { through: IssuerOwner }))
  // are defined in the models that it connects.
  // Therefore, a static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  IssuerOwner.init(
    {
      // --- RUNTIME DEFINITIONS ---
      issuerOwnerId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "IssuerOwner",
      tableName: "issuerOwners", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return IssuerOwner;
};
