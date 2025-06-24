import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface ProfilePicAttributes {
  profilePicId: string;
  name: string;
  path: string;
  originalPath: string | null;
  mimeType: string;
}

// Extend Sequelize's Model class and implement our attributes interface
export class ProfilePic
  extends Model<ProfilePicAttributes>
  implements ProfilePicAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public profilePicId!: string;
  public name!: string;
  public path!: string;
  public originalPath!: string | null;
  public mimeType!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  ProfilePic.init(
    {
      // --- RUNTIME DEFINITIONS ---
      profilePicId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalPath: {
        type: DataTypes.STRING,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "ProfilePic",
      tableName: "profilePics", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return ProfilePic;
};
