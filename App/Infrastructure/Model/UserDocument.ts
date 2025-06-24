import { Model, DataTypes, Sequelize } from "sequelize";

// Interface for type-safety on instance attributes
interface UserDocumentAttributes {
  userDocumentId: string;
  documentType: string;
  name: string;
  path: string;
  mimeType: string;
  ext: string | null;
  year: number | null;
  campaignId: string | null;
}

// Extend Sequelize's Model class and implement our attributes interface
export class UserDocument
  extends Model<UserDocumentAttributes>
  implements UserDocumentAttributes
{
  // --- TYPE DEFINITIONS ---
  // These properties are explicitly declared for TypeScript's benefit.
  public userDocumentId!: string;
  public documentType!: string;
  public name!: string;
  public path!: string;
  public mimeType!: string;
  public ext!: string | null;
  public year!: number | null;
  public campaignId!: string | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  // This model does not define any associations itself,
  // so the static 'associate' method is not needed here.
  // The relationship is likely defined in another model (e.g., User.hasMany(UserDocument)).
}

// The exported initialization function
export default (sequelize: Sequelize, DataTypes: any) => {
  UserDocument.init(
    {
      // --- RUNTIME DEFINITIONS ---
      userDocumentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      documentType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ext: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
      },
      campaignId: {
        type: DataTypes.STRING,
      },
    },
    {
      // --- Model Options ---
      sequelize,
      modelName: "UserDocument",
      tableName: "userDocuments", // Explicitly set table name
      timestamps: true,
      paranoid: true,
    }
  );

  return UserDocument;
};
